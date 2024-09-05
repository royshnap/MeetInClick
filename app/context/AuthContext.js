import { createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, signOut } from "firebase/auth";
import React, { useEffect, useState } from "react";
import Firebase from "../config/firebase";
import { onValue, ref, set } from "firebase/database";

const AuthContext = React.createContext(null);

export const AuthContextProvider = ({ children }) => {
    const [user, setUser] = useState(undefined); 
    const [loading, setLoading] = useState(false); 
    const [error, setError] = useState(false); 

    // Function to register a new user
    const register = async (user) => {
        setLoading(true); 
        setError(undefined); 
        try {
            // Create user with email and password
            const authResult = await createUserWithEmailAndPassword(Firebase.Auth, user.email, user.password);
            user.id = authResult.user.uid; // Set user ID from authentication result
            delete user["password"]; // Remove password from user object
            const usersRef = ref(Firebase.Database, `users/${user.id}`); // Reference to user's data in the database
            set(usersRef, user); 
            setUser(user); 
        } catch (e) {
            setError(e);
        } finally {
            setLoading(false); 
        }
    };

    // Function to log in an existing user
    const login = async (email, password) => {
        setLoading(true); 
        setError(undefined); 
        try {
            await signInWithEmailAndPassword(Firebase.Auth, email, password); 
        } catch (e) {
            setError(e); 
        } finally {
            setLoading(false); 
        }
    };

    //Function to sign out the current user
    const signOutUser = async (navigation) => {
        try {
            await signOut(Firebase.Auth); 
            setUser(null); 
        } catch (e) {
            setError(e); 
        }
    };

    // Effect to handle authentication state changes
    useEffect(() => {
        let userDocListener = undefined; 
        const unsub = onAuthStateChanged(Firebase.Auth, (userState) => {
            if (userState) {
                const usersRef = ref(Firebase.Database, `users/${userState.uid}`);
                userDocListener = onValue(usersRef, (doc) => {
                    const userASJson = doc.val(); 
                    setUser(userASJson);
                });
            } else {
                setUser(undefined);
            }
        });

        return () => {
            unsub(); 
            if (userDocListener) {
                userDocListener(); 
            }
        };
    }, []);

    return (
        <AuthContext.Provider value={{ user, loading, error, register, login, signOutUser, setError }}>
            {children}
        </AuthContext.Provider>
    );
};

// Hook to use authentication context
export const useAuth = () => {
    const context = React.useContext(AuthContext);
    if (!context) {
        throw new Error("AuthContext used outside of AuthContextProvider");
    }
    return context;
};
