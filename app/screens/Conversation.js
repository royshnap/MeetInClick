import { useMemo, useState, useEffect, useRef } from 'react';
import { useActiveConversation } from '../context/ConversationContext';
import {
  TextInput,
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  Alert,
} from 'react-native';
import { Link } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import { FlatList } from 'react-native-gesture-handler';
import { ref, get } from 'firebase/database';
import Firebase from '../config/firebase';
import { addMessageNotification } from '../context/notification'; // Adjust the import path

const MAX_CHARACTERS = 100;

const MessageItem = ({ message, currentUser, otherUser }) => {
  if (!currentUser) return;
  const sender =
    message.sender === currentUser.id
      ? currentUser.username
      : otherUser?.username || 'Unknown';
  return (
    <View style={styles.messageItem}>
      <Text style={styles.senderText}>{sender}</Text>
      <Text style={styles.messageText}>{message.content}</Text>
    </View>
  );
};
const Conversation = ({ route, navigation }) => {
  const conversationId = useMemo(() => {
    return route.params?.cid;
  }, [route]);
  const { t } = useTranslation();

  const {
    activeConversation,
    conversationLoading,
    conversationLoadingError,
    sendMessageToConversation,
  } = useActiveConversation({ route, navigation });

  const [messageContent, setMessageContent] = useState('');
  const [totalCharacters, setTotalCharacters] = useState(0);
  const { user } = useAuth();
  const [otherUser, setOtherUser] = useState(null);
  const flatListRef = useRef(null);

  useEffect(() => {
    if (!user || !activeConversation) return; // Check if user and activeConversation are defined

    const fetchOtherUser = async () => {
      const otherUserId =
        activeConversation.user_1 === user.id
          ? activeConversation.user_2
          : activeConversation.user_1;
      const userRef = ref(Firebase.Database, `users/${otherUserId}`);
      const snapshot = await get(userRef);
      if (snapshot.exists()) {
        setOtherUser(snapshot.val());
      }
    };

    fetchOtherUser();
  }, [activeConversation, user]);

  useEffect(() => {
    if (!user || !activeConversation || !activeConversation.messages) return; // Check if user, activeConversation, and messages are defined

    const total = activeConversation.messages
      .filter((message) => message.sender === user.id)
      .reduce(
        (acc, message) => acc + message.content.replace(/\s+/g, '').length,
        0
      );
    setTotalCharacters(total);

    flatListRef.current?.scrollToEnd({ animated: true });
  }, [activeConversation, user]);

  const sendMessage = () => {
    if (!user) return; // Check if user is defined before sending a message

    const trimmedMessageContent = messageContent.replace(/\s+/g, '');
    if (trimmedMessageContent.length + totalCharacters > MAX_CHARACTERS) {
      Alert.alert(
        'Character limit exceeded',
        `You can only send a total of ${MAX_CHARACTERS} characters.`
      );
    } else {
      sendMessageToConversation(conversationId, messageContent);
      setMessageContent('');

      if (otherUser) {
        addMessageNotification(otherUser.id, user.username);
      }
      flatListRef.current?.scrollToEnd({ animated: true });
    }
  };

  if (conversationLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Conversation loading...</Text>
      </View>
    );
  }

  if (conversationLoadingError || !activeConversation) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>
          Oops! There was an error loading the conversation.{' '}
          <Link to={{ screen: 'Conversations' }} style={styles.linkText}>
            Back to conversation list
          </Link>
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {otherUser && (
        <Text style={styles.headerText}>
          Conversation with {otherUser.username}
        </Text>
      )}
      <Text style={styles.subtitle}>
        You have up to {MAX_CHARACTERS} characters to set a place to meet
      </Text>
      <FlatList
        ref={flatListRef}
        data={activeConversation.messages || []}
        renderItem={({ item: message }) => (
          <MessageItem
            otherUser={otherUser}
            currentUser={user}
            message={message}
          />
        )}
        keyExtractor={(item) => item.date.toString()}
        onContentSizeChange={() =>
          flatListRef.current?.scrollToEnd({ animated: true })
        }
      />
      {user && ( // Only render the input and send button if the user is defined
        <>
          <TextInput
            placeholder={t('Enter message')}
            value={messageContent}
            onChangeText={setMessageContent}
            maxLength={
              MAX_CHARACTERS -
              totalCharacters +
              messageContent.replace(/\s+/g, '').length
            }
            style={styles.input}
          />
          <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
            <Text style={styles.sendButtonText}>{t('Send')}</Text>
          </TouchableOpacity>
          <Text style={styles.characterCount}>
            {totalCharacters}/{MAX_CHARACTERS} characters used
          </Text>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#FAFAFA',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 18,
    color: '#333333',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 18,
    color: '#F44336',
    textAlign: 'center',
  },
  linkText: {
    color: '#2196F3',
    fontWeight: 'bold',
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#2196F3',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#777777',
    marginBottom: 20,
    textAlign: 'center',
  },
  messageItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  senderText: {
    fontSize: 14,
    color: '#666666',
    fontWeight: 'bold',
    marginBottom: 5,
  },
  messageText: {
    fontSize: 16,
    color: '#333333',
  },
  input: {
    height: 50,
    borderColor: '#CCCCCC',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  sendButton: {
    backgroundColor: '#2196F3',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  sendButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  characterCount: {
    textAlign: 'center',
    color: '#333333',
    marginTop: 10,
  },
});

export default Conversation;
