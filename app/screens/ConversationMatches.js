import React, { useCallback, useMemo } from "react";
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { useConversationTopicMatches } from "../context/ConversationContext";
import { useAuth } from "../context/AuthContext";

// Component to render each match item
const MatchItem = ({ otherUser, navigation }) => {
  const {
    startConversation, 
    sendConversationRequest, 
    isApproved, 
    requests, 
    isDeclined, 
    isPending,
  } = useConversationTopicMatches(); // Hook to manage conversation topic matches
  const { user } = useAuth(); // Hook to get the current authenticated user

  // Function to handle starting a conversation
  const handlePressStartConversation = async (requestId_1, requestId_2) => {
    try {
      const conversationId = await startConversation(otherUser.id, requestId_1, requestId_2);
      if (conversationId) {
        navigation.navigate(`Conversation`, { cid: conversationId }); // Navigate to the conversation screen
      } else {
        Alert.alert(`There was a problem starting conversation with ${otherUser.username}`);
      }
    } catch (e) {
      Alert.alert(e.message); // Alert if there's an error
    }
  };

  // Function to handle sending a conversation request
  const handlePressSendRequest = async () => {
    try {
      const conversationId = await sendConversationRequest(otherUser.id);
      if (conversationId) {
        Alert.alert(`Request has been sent to ${otherUser.username}`);
      } else {
        Alert.alert(`There was a problem sending conversation request to ${otherUser.username}`);
      }
    } catch (e) {
      Alert.alert(e.message); // Alert if there's an error
    }
  };

  // Component to display the status of the conversation request
  const Status = useCallback(() => {
    const approved = isApproved(otherUser.id);
    const declined = isDeclined(otherUser.id);
    const { sender, recipient } = isPending(otherUser.id);
    const cid1 = `${otherUser.id}_${user.id}`;
    const cid2 = `${user.id}_${otherUser.id}`;

    // Button to start a conversation
    const StartConversationButton = () => (
      <TouchableOpacity
        style={[styles.startConversationButton, { backgroundColor: approved ? "#4CAF50" : sender ? "#BDBDBD" : "transparent" }]}
        disabled={!sender && !approved}
        onPress={() => handlePressStartConversation(cid1, cid2)}
      >
        <Text
          style={{
            color: approved || sender ? "#FFFFFF" : declined ? "#F44336" : "#9E9E9E",
          }}
        >
          Start conversation
        </Text>
      </TouchableOpacity>
    );

    if (approved) {
      return (
        <View>
          <Text style={styles.statusText}>Status: Approved</Text>
          <StartConversationButton />
        </View>
      );
    } else if (declined) {
      return (
        <View>
          <Text style={styles.statusText}>Status: Declined</Text>
          <StartConversationButton />
        </View>
      );
    } else if (sender || recipient) {
      return (
        <View>
          <Text style={styles.statusText}>Status: Pending</Text>
          <StartConversationButton />
        </View>
      );
    }
    return (
      <View>
        <TouchableOpacity style={styles.button} onPress={handlePressSendRequest}>
          <Text style={styles.buttonText}>Send conversation request</Text>
        </TouchableOpacity>
      </View>
    );
  }, [requests]);

  return (
    <View style={styles.matchItem}>
      <View style={styles.matchItemTextContainer}>
        <Text style={styles.matchText}>User name: {otherUser.username}</Text>
        <Text style={styles.topicsText}>Topics: {otherUser.conversationTopics.join(", ")}</Text>
      </View>
      <Status />
    </View>
  );
};

// Component to render the list of conversation matches
const ConversationMatches = ({ navigation }) => {
  const { conversationTopicResults } = useConversationTopicMatches(); // Hook to get conversation topic results
  const { user } = useAuth(); // Hook to get the current authenticated user

  return (
    <View style={styles.container}>
      {conversationTopicResults.length === 0 && (
        <Text style={styles.noMatchesText}>No matches found for the selected topics.</Text>
      )}
      {conversationTopicResults.length > 0 && <Text style={styles.matchesText}>Matches:</Text>}
      <FlatList
        data={conversationTopicResults} // Data for FlatList
        renderItem={({ item: otherUser }) => (
          <MatchItem otherUser={otherUser} navigation={navigation} /> // Render each match item
        )}
        keyExtractor={(item) => item.id} // Unique key for each item
      />
    </View>
  );
};

const styles = StyleSheet.create({
  smallText: {
    fontSize: 12,
    color: "#757575",
  },
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#FAFAFA",
  },
  noMatchesText: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: "center",
    color: "#F44336",
  },
  matchesText: {
    fontSize: 20,
    marginBottom: 20,
    color: "#2196F3",
    fontWeight: "bold",
    textAlign: "center",
  },
  matchItem: {
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    justifyContent: "space-between",
    flexDirection: "row",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  matchItemTextContainer: {
    flex: 1,
  },
  matchText: {
    fontSize: 16,
    color: "#333333",
    fontWeight: "bold",
  },
  topicsText: {
    fontSize: 14,
    color: "#666666",
  },
  button: {
    padding: 10,
    borderRadius: 5,
    backgroundColor: "#2196F3",
    alignItems: "center",
  },
  startConversationButton: {
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "bold",
  },
  statusText: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 5,
  },
});

export default ConversationMatches;
