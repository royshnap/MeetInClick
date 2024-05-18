import React from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useConversationTopicMatches } from '../context/ConversationContext';
import { useAuth } from '../context/AuthContext';

const MatchItem = ({ otherUser,navigation }) => {

    const { startConversation } = useConversationTopicMatches();

    const handlePress = async () => {
        try {
        const conversationId = await startConversation(otherUser.id)
        if(conversationId)
            navigation.navigate(`Conversation`, {cid: conversationId})
        else    
                Alert.alert(`There was a problem starting conversation with ${otherUser.username}`)
    }catch(e) {
        Alert.alert(e.message)
    }
    };

    return (
            <View style={styles.matchItem}>
                <Text style={styles.matchText}>User name: {otherUser.username}</Text>
                <TouchableOpacity onPress = { handlePress }>
                    <Text>
                        Start conversation
                    </Text>
                </TouchableOpacity>
            </View>
    );
};

const ConversationMatches = ({navigation}) => {
    const { conversationTopicResults } = useConversationTopicMatches();
    const { user } = useAuth();

    return (
        <View style={styles.container}>
            {conversationTopicResults.length === 0 && (
                <Text style={styles.noMatchesText}>No matches found for the selected topics.</Text>
            )}
            {conversationTopicResults.length > 0 && <Text style={styles.matchesText}>Matches:</Text>}
            <FlatList
                data={conversationTopicResults}
                renderItem={({ item: otherUser }) => <MatchItem otherUser={otherUser} navigation={navigation}/>}
                keyExtractor={item => item.id}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#FFFFFF',
    },
    noMatchesText: {
        fontSize: 18,
        marginBottom: 20,
        textAlign: 'center',
        color: '#555555',
    },
    matchesText: {
        fontSize: 18,
        marginBottom: 10,
        color: '#333333',
    },
    matchItem: {
        backgroundColor: '#F0F0F0',
        borderRadius: 10,
        padding: 10,
        marginBottom: 10,
    },
    matchText: {
        fontSize: 16,
        color: '#333333',
    },
});

export default ConversationMatches;
