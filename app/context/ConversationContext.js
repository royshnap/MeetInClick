import { ref, query, orderByChild, equalTo, get, update } from "firebase/database";

import Firebase from "../config/firebase";
import { useState } from "react";
import { useAuth } from "./AuthContext";
import React from 'react';

const ConversationContext = React.createContext(null);

export const ConversationContextProvider = ({ children }) => {
    const { user } = useAuth();

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(undefined);
    const [conversationTopicResults, setConversationTopicResults] = useState([]);

    const listUsersByConversationTopics = async (topics) => {
        const currentUserRef = ref(Firebase.Database, `users/${user.id}`);
        await update(currentUserRef, { conversationTopics: topics });
    
        const usersRef = ref(Firebase.Database, "users");
        setError(undefined);
    
        try {
            setLoading(true);
            const results = [];
    
            for (const topic of topics) {
                const q = query(usersRef, orderByChild("conversationTopics"));
                const snapshot = await get(q);
    
                snapshot.forEach((doc) => {
                    const otherUser = doc.val();
                    if (otherUser.id !== user.id && otherUser.conversationTopics && otherUser.conversationTopics.includes(topic) && !results.some(u => u.id === otherUser.id)) {
                        results.push(otherUser);
                    }
                });
            }
    
            setConversationTopicResults(results);
            setLoading(false);
            return results.length > 0;
        } catch (e) {
            console.log(e);
            setError(e);
            setLoading(false);
        }
    
        return false;
    };
    
    return (
        <ConversationContext.Provider value={{ listUsersByConversationTopics, loading, error, conversationTopicResults }}>
            {children}
        </ConversationContext.Provider>
    );
};

export const useConversationTopicMatches = () => {
    const context = React.useContext(ConversationContext);
    if (!context) {
        throw new Error("ConversationContext used outside of ConversationContextProvider");
    }
    return context;
};
