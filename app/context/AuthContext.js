import { createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, signOut } from "firebase/auth";
import React, { useEffect, useState } from "react";
import Firebase from "../config/firebase";
import { onValue, ref, set } from "firebase/database";

const AuthContext = React.createContext(null);

export const AuthContextProvider = ({ children }) => {
    const [user, setUser] = useState(undefined);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);

    const register = async (user) => {
        setLoading(true);
        setError(undefined);
        try {
            const authResult = await createUserWithEmailAndPassword(Firebase.Auth, user.email, user.password);
            user.id = authResult.user.uid;
            delete user["password"];
            const usersRef = ref(Firebase.Database, `users/${user.id}`);
            set(usersRef, user);
            setUser(user);
        } catch (e) {
            setError(e);
        } finally {
            setLoading(false);
        }
    };

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

    const signOutUser = async () => {
        try {
            await signOut(Firebase.Auth);
            setUser(null);
        } catch (e) {
            setError(e);
        }
    };

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

export const useAuth = () => {
    const context = React.useContext(AuthContext);
    if (!context) {
        throw new Error("AuthContext used outside of AuthContextProvider");
    }
    return context;
};
