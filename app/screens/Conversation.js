import { useMemo, useState } from "react";
import { useActiveConversation } from "../context/ConversationContext";
import { TextInput, View, TouchableOpacity,Text } from "react-native";


import {Link} from '@react-navigation/native'
import { useAuth } from "../context/AuthContext";
import { FlatList } from "react-native-gesture-handler";



const MessageItem = ({otherUser, message}) => {
    return <View>
        <Text>{message.content}</Text>
    </View>
}
const Conversation = ( { route} )  => {


    const conversationId = useMemo(() =>  {
        return route.params?.cid
    }, [route])

    const {activeConversation, conversationLoading, conversationLoadingError, sendMessageToConversation} = useActiveConversation({route})

    const [messageContent,setMessageContent] = useState("")
    const {user} = useAuth()
    const otherUser = useMemo(() =>  {
        if(!activeConversation) return null
        if(activeConversation.user_1.id === user.id)
                return activeConversation.user_2

        return activeConversation.user_1
    }, [user, activeConversation])

    const sendMessage =() => {
        if(messageContent) {
            sendMessageToConversation(messageContent)
        }
    }

    if(conversationLoading) {
        return <View>
            <Text>Conversation loading..</Text>
        </View>
    }

    if(conversationLoadingError || !activeConversation) {
       return <View>
            <Text>Opps! there was error loading conversation   <Link to={{screen: "Conversations"}}>Back to conversation list</Link></Text>
        </View>
    }

    

    return <View>


        {otherUser && <Text>Conversation with {otherUser.username}</Text>}

        <FlatList
                data={activeConversation.messages}
                renderItem={({ item: message }) => <MessageItem otherUser={otherUser} message={message} />}
                keyExtractor={item => item.id}
            />
            <TextInput placeholder="Enter message" value={messageContent} onChangeText={setMessageContent}></TextInput>
            <TouchableOpacity onPress={sendMessage}>
                <Text>Send</Text>
            </TouchableOpacity>
    </View>

}

export default Conversation