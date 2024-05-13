import { View , Text} from "react-native";
import { FlatList } from "react-native-gesture-handler";
import { useConversationTopicMatches } from "../context/ConversationContext";
import { useAuth } from "../context/AuthContext";


const MatchItem = ({otherUser}) => {
    return <View>
        <Text>User name: {otherUser.username} </Text>
    </View>
}

export default function ConversationMatches() {

   const { conversationTopicResults} = useConversationTopicMatches()
   const {user} = useAuth()

    return <View>
        {!conversationTopicResults && <Text>No matches found for topic {user?.conversationTopic}</Text>}
        {conversationTopicResults && <Text>Matches:</Text>}
        <FlatList data={conversationTopicResults} 
                  renderItem={({item : otherUser}) => <MatchItem otherUser={otherUser}/>} 
                keyExtractor={item => item.id}/>
    </View>
}