import { createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, signOut } from "firebase/auth";
import React, { useEffect, useState } from "react";
import Firebase from "../config/firebase";
import { onValue, ref, set } from "firebase/database";

const AuthContext = React.createContext(null);

export const AuthContextProvider = ({ children }) => {
    const [user, setUser] = useState(undefined); // string user = undifinnd,State to manage the authenticated user
    const [loading, setLoading] = useState(false); // State to manage loading status
    const [error, setError] = useState(false); // State to manage error status

    // Function to register a new user
    const register = async (user) => {
        setLoading(true); // Set loading state to true
        setError(undefined); // Reset error state
        try {
            // Create user with email and password
            const authResult = await createUserWithEmailAndPassword(Firebase.Auth, user.email, user.password);
            user.id = authResult.user.uid; // Set user ID from authentication result
            delete user["password"]; // Remove password from user object
            const usersRef = ref(Firebase.Database, `users/${user.id}`); // Reference to user's data in the database
            set(usersRef, user); // Save user data in the database
            setUser(user); // Set user state
        } catch (e) {
            setError(e); // Set error state if there's an error
        } finally {
            setLoading(false); // Set loading state to false
        }
    };

    // Function to log in an existing user
    const login = async (email, password) => {
        setLoading(true); // Set loading state to true
        setError(undefined); // Reset error state
        try {
            await signInWithEmailAndPassword(Firebase.Auth, email, password); // Sign in with email and password
        } catch (e) {
            setError(e); // Set error state if there's an error
        } finally {
            setLoading(false); // Set loading state to false
        }
    };

    //Function to sign out the current user
    const signOutUser = async (navigation) => {
        try {
            await signOut(Firebase.Auth); // Sign out the user
            setUser(null); // Reset user state to null
        } catch (e) {
            setError(e); // Set error state if there's an error
        }
    };

    // Effect to handle authentication state changes
    useEffect(() => {
        let userDocListener = undefined; // Listener for user data changes
        const unsub = onAuthStateChanged(Firebase.Auth, (userState) => {
            if (userState) {
                const usersRef = ref(Firebase.Database, `users/${userState.uid}`); // Reference to user's data in the database
                userDocListener = onValue(usersRef, (doc) => {
                    const userASJson = doc.val(); // Get user data as JSON
                    setUser(userASJson); // Set user state
                });
            } else {
                setUser(undefined); // Reset user state if not authenticated
            }
        });

        return () => {
            unsub(); // Unsubscribe from authentication state changes
            if (userDocListener) {
                userDocListener(); // Unsubscribe from user data changes
            }
        };
    }, []);

    // Provide authentication context to children components
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
