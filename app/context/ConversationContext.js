import { equalTo, get, orderByChild, orderByValue, query, ref, update } from "firebase/database"
import Firebase from "../config/firebase"
import { useState } from "react"
import { useAuth } from "./AuthContext"
import React from 'react'

const ConversationContext = React.createContext(null)

export const ConversationContextProvider = ({children} ) => {

    const {user} = useAuth()

    const [loading,setLoading] = useState(false)
    const [error,setError] = useState(undefined)
    const [conversationTopicResults,setConversationTopicResults] = useState([])
    const listUsersByConversationTopic = async (topic) => {

        const currentUser = ref(Firebase.Database, `users/${user.id}`)

        await update(currentUser, {conversationTopic: topic}) 

        const users = ref(Firebase.Database, "users")
        const q = query(users, orderByChild("conversationTopic"), equalTo(topic))
        setError(undefined)
        try {
            setLoading(true)
            const snapshot = await get(q)
            const results =  []
            snapshot.forEach((doc) => {
                const otherUser = doc.val()
                if(otherUser.id != user.id)
                    results.push(otherUser)
            })
            setConversationTopicResults(results)
            setLoading(false)
            return true
        }catch(e) {
            console.log(e)
            setError(e)
            setLoading(false)
        }
       
           
        
        return false
    }

    return <ConversationContext.Provider value={{listUsersByConversationTopic, loading,error, conversationTopicResults}}>
        {children}
    </ConversationContext.Provider>
}

export const useConversationTopicMatches = () => {
    const context = React.useContext(ConversationContext)
    if(!context) {
        throw new Error("ConversationContext used outside of ConversationContextProvider")
    }
    return context
}