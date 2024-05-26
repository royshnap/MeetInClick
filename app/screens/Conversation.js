import { useMemo, useState } from "react";
import { useActiveConversation } from "../context/ConversationContext";
import { TextInput, View, TouchableOpacity, Text, StyleSheet } from "react-native";
import { Link } from "@react-navigation/native";
import { useAuth } from "../context/AuthContext";
import { FlatList } from "react-native-gesture-handler";

// Component to render each message item
const MessageItem = ({ otherUser, message }) => {
  return (
    <View style={styles.messageItem}>
      <Text style={styles.messageText}>{message.content}</Text>
    </View>
  );
};

const Conversation = ({ route, navigation }) => {
  // Memoized conversation ID from route parameters
  const conversationId = useMemo(() => {
    return route.params?.cid;
  }, [route]);

  const {
    activeConversation, // Active conversation state
    conversationLoading, // Loading state for conversation
    conversationLoadingError, // Error state for conversation loading
    sendMessageToConversation, // Function to send a message in the conversation
  } = useActiveConversation({ route, navigation });

  const [messageContent, setMessageContent] = useState(""); // State for managing the message content
  const { user } = useAuth(); // Hook to get the current authenticated user

  // Memoized other user in the conversation
  const otherUser = useMemo(() => {
    if (!activeConversation) return null;
    if (activeConversation.user_1.id === user.id) return activeConversation.user_2;
    return activeConversation.user_1;
  }, [user, activeConversation]);

  // Function to send a message
  const sendMessage = () => {
    if (messageContent) {
      sendMessageToConversation(conversationId, messageContent);
      setMessageContent(""); // Clear the message input
    }
  };

  // Render loading state
  if (conversationLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Conversation loading..</Text>
      </View>
    );
  }

  // Render error state or if no active conversation
  if (conversationLoadingError || !activeConversation) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>
          Oops! There was an error loading the conversation.{" "}
          <Link to={{ screen: "Conversations" }} style={styles.linkText}>Back to conversation list</Link>
        </Text>
      </View>
    );
  }

  // Render the conversation view
  return (
    <View style={styles.container}>
      {otherUser && <Text style={styles.headerText}>Conversation with {otherUser.username}</Text>}

      <FlatList
        data={activeConversation.messages} // Data for FlatList: messages in the active conversation
        renderItem={({ item: message }) => (
          <MessageItem otherUser={otherUser} key={message.id} message={message} /> // Render each message item
        )}
        keyExtractor={(item) => item.id} // Unique key for each message
      />
      <TextInput
        placeholder="Enter message"
        value={messageContent}
        onChangeText={setMessageContent} // Handle text input changes
        style={styles.input}
      />
      <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
        <Text style={styles.sendButtonText}>Send</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#FAFAFA",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 18,
    color: "#333333",
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 18,
    color: "#F44336",
    textAlign: 'center',
  },
  linkText: {
    color: "#2196F3",
    fontWeight: "bold",
  },
  headerText: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#2196F3",
    textAlign: "center",
  },
  messageItem: {
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  messageText: {
    fontSize: 16,
    color: "#333333",
  },
  input: {
    height: 50,
    borderColor: "#CCCCCC",
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  sendButton: {
    backgroundColor: "#2196F3",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  sendButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default Conversation;
