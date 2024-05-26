import React, { useCallback, useMemo } from "react";
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { useConversationTopicMatches } from "../context/ConversationContext";
import { useAuth } from "../context/AuthContext";

const MatchItem = ({ otherUser, navigation }) => {
  const {
    startConversation,
    sendConversationRequest,
    isApproved,
    requests,
    isDeclined,
    isPending,
  } = useConversationTopicMatches();
  const { user } = useAuth();

  const handlePressStartConversation = async (requestId_1, requestId_2) => {
    try {
      const conversationId = await startConversation(otherUser.id, requestId_1, requestId_2);
      //navigation.navigate(`Conversation`, {cid: conversationId})
      if (conversationId) {
        navigation.navigate(`Conversation`, { cid: conversationId });
      } else Alert.alert(`There was a problem starting conversation with ${otherUser.username}`);
    } catch (e) {
      Alert.alert(e.message);
    }
  };

  const handlePressSendRequest = async () => {
    try {
      const conversationId = await sendConversationRequest(otherUser.id);
      //navigation.navigate(`Conversation`, {cid: conversationId})
      if (conversationId) {
        Alert.alert(`Request has been send to  ${otherUser.username}`);
      } else
        Alert.alert(`There was a problem sending conversation request to ${otherUser.username}`);
    } catch (e) {
      Alert.alert(e.message);
    }
  };

  const Status = useCallback(() => {
    const approved = isApproved(otherUser.id);
    const declined = isDeclined(otherUser.id);
    const { sender, recipient } = isPending(otherUser.id);
    const cid1 = `${otherUser.id}_${user.id}`;
    const cid2 = `${user.id}_${otherUser.id}`;
    const StartConversationButton = () => (
      <TouchableOpacity
        disabled={!sender && !approved}
        onPress={() => handlePressStartConversation(cid1, cid2)}
      >
        <Text
          style={{
            color: approved || sender ? "green" : declined ? "red" : "gray",
          }}
        >
          Start conversation
        </Text>
      </TouchableOpacity>
    );

    if (approved) {
      return (
        <View>
          <Text style={styles.smallText}>Status: Approved</Text>
          <StartConversationButton />
        </View>
      );
    } else if (declined) {
      return (
        <View>
          <Text style={styles.smallText}>Status: Declined</Text>
          <StartConversationButton />
        </View>
      );
    } else if (sender || recipient) {
      return (
        <View>
          <Text style={styles.smallText}>Status: Pending</Text>
          <StartConversationButton />
        </View>
      );
    }
    return (
      <View>
        <TouchableOpacity onPress={handlePressSendRequest}>
          <Text style={styles.smallText}>Send conversation request</Text>
        </TouchableOpacity>
      </View>
    );
  }, [requests]);

  return (
    <View style={styles.matchItem}>
      <Text style={styles.matchText}>User name: {otherUser.username}</Text>
      <Status />
    </View>
  );
};

const ConversationMatches = ({ navigation }) => {
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
        renderItem={({ item: otherUser }) => (
          <MatchItem otherUser={otherUser} navigation={navigation} />
        )}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  smallText: {
    fontSize: 12,
  },
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#FFFFFF",
  },
  noMatchesText: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: "center",
    color: "#555555",
  },
  matchesText: {
    fontSize: 18,
    marginBottom: 10,
    color: "#333333",
  },
  matchItem: {
    backgroundColor: "#F0F0F0",
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    flex: 1,
    justifyContent: "space-between",
    flexDirection: "row",
  },
  matchText: {
    fontSize: 16,
    color: "#333333",
  },
});

export default ConversationMatches;
