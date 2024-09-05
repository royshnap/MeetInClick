import {
  ref,
  query,
  orderByChild,
  equalTo,
  get,
  update,
  set,
  onValue,
} from 'firebase/database';
import Firebase from '../config/firebase';
import { useEffect, useState } from 'react';
import { useAuth } from './AuthContext';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { mapFirebaseResults, mapFirebaseResultsDict } from '../../utils';

const ConversationContext = React.createContext(null);

export const ConversationContextProvider = ({ children }) => {
  const { user } = useAuth(); 
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false); // State to manage loading status
  const [error, setError] = useState(undefined); 
  const [requests, setRequests] = useState({
    // State to manage conversation requests
    pending: {},
    approved: {},
    declined: {},
  });
  const [conversationTopicResults, setConversationTopicResults] = useState([]); // State to manage conversation topic results
  const [conversations, setConversations] = useState(undefined); // State to manage all conversations
  const [activeConversation, setActiveConversation] = useState(undefined); // State to manage the active conversation

  // Function to get all conversations of the user
  const getAllConversations = async (refresh = false) => {
    if (!refresh && conversations) {
      return; // No need to refresh existing conversations
    }
    setLoading(true);
    try {
      const dbRef = ref(Firebase.Database, `conversations`);
      const allUsersMap = await get(ref(Firebase.Database, 'users')).then(
        mapFirebaseResultsDict
      );

      const [result_1, result_2] = await Promise.all([
        get(query(dbRef, orderByChild('user_1'), equalTo(user.id))).then(
          mapFirebaseResults
        ),
        get(query(dbRef, orderByChild('user_2'), equalTo(user.id))).then(
          mapFirebaseResults
        ),
      ]);

      const conversations = [...result_1, ...result_2];

      for (var conversation of conversations) {
        if (conversation.user_1 === user.id) {
          conversation.user_1 = user;
          conversation.user_2 = allUsersMap[conversation.user_2];
        } else {
          conversation.user_2 = user;
          conversation.user_1 = allUsersMap[conversation.user_1];
        }
      }
      setConversations(conversations);
    } catch (e) {
      setError(e); // Set error state if there's an error
    } finally {
      setLoading(false); // Set loading state to false
    }
  };

  // Effect to listen for authentication state changes and requests
  useEffect(() => {
    let unsubscribe = undefined;
    if (user) {
      unsubscribe = listenRequests();
    }
    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [user]);

  // Function to listen for changes in a specific conversation
  const listenConversation = (cid, onLoad) => {
    return onValue(
      ref(Firebase.Database, `conversations/${cid}`),
      (res) => {
        const conversation = res.val();
        setActiveConversation(conversation);
        onLoad();
      },
      (e) => {
        onLoad(e);
      }
    );
  };

  // Function to start a new conversation
  const startConversation = async (otherUserId, requestId_1, requestId_2) => {
    setLoading(true);
    try {
      if (!isApproved(otherUserId)) {
        await approveConversationRequest(requestId_1);
        await approveConversationRequest(requestId_2);
      }

      const cid_1 = `${user.id}_${otherUserId}`;
      const cid_2 = `${otherUserId}_${user.id}`;

      const dbRefU1 = ref(Firebase.Database, `conversations/${cid_1}`);
      const dbRefU2 = ref(Firebase.Database, `conversations/${cid_2}`);
      const existing_1 = await get(dbRefU1);
      const existing_2 = await get(dbRefU2);

      if (existing_1.exists() || existing_2.exists()) {
        setLoading(false);
        return existing_1.exists() ? cid_1 : cid_2;
      }

      await set(dbRefU1, {
        cid_1,
        messages: [],
        user_1: user.id,
        user_2: otherUserId,
      });
      return cid_1;
    } catch (e) {
      setError(e); // Set error state if there's an error
    } finally {
      setLoading(false); // Set loading state to false
    }
    return null;
  };

  // Function to send a conversation request
  const sendConversationRequest = async (otherUserId) => {
    setLoading(true);
    try {
      const cid_1 = `${user.id}_${otherUserId}`;
      const cid_2 = `${otherUserId}_${user.id}`;

      const dbRefU1 = ref(Firebase.Database, `requests/${cid_1}`);
      const dbRefU2 = ref(Firebase.Database, `requests/${cid_2}`);
      const existing_1 = await get(dbRefU1);
      const existing_2 = await get(dbRefU2);

      if (existing_1.exists() || existing_2.exists()) {
        setLoading(false);
        if (existing_1.exists()) {
          await update(dbRefU1, { status: 'approved' });
          return cid_1;
        } else {
          await update(dbRefU2, { status: 'approved' });
          return cid_2;
        }
      }

      await set(dbRefU1, {
        cid_1,
        status: 'pending',
        user_1: user.id,
        user_2: otherUserId,
      });
      return cid_1;
    } catch (e) {
      setError(e); // Set error state if there's an error
    } finally {
      setLoading(false); // Set loading state to false
    }
    return null;
  };

  // Function to listen for conversation requests
  const listenRequests = () => {
    const dbRefU1 = ref(Firebase.Database, `requests`);
    const unsub = onValue(dbRefU1, (val) => {
      const relevant = [];

      val.forEach((doc) => {
        if (doc.key.includes(user.id)) {
          relevant.push(doc.val());
        }
      });
      const mapping = {
        approved: {},
        pending: {},
        declined: {},
      };
      for (var request of relevant) {
        mapping[request['status']][request.cid_1] = request;
      }
      setRequests(mapping);
    });
    return unsub;
  };

  // Function to decline a conversation request
  const declineConversationRequest = async (requestId) => {
    const dbRefU1 = ref(Firebase.Database, `requests/${requestId}`);
    await update(dbRefU1, { status: 'declined' });
  };

  // Function to approve a conversation request
  const approveConversationRequest = async (requestId) => {
    const dbRefU1 = ref(Firebase.Database, `requests/${requestId}`);
    await update(dbRefU1, { status: 'approved' });
  };

  // Function to list users by their conversation topics
  const listUsersByConversationTopics = async (topics) => {
    try {
      // Ensure the user is authenticated and has a valid UID
      const user = Firebase.Auth.currentUser;

      if (!user || !user.uid) {
        console.error('User is not authenticated or UID is undefined.');
        return; // Exit the function if the user is not properly authenticated
      }

      const currentUserRef = ref(Firebase.Database, `users/${user.uid}`);
      await update(currentUserRef, { conversationTopics: topics });

      const usersRef = ref(Firebase.Database, 'users');
      setError(undefined);

      setLoading(true);

      const results = [];

      for (const topic of topics) {
        const q = query(usersRef, orderByChild('conversationTopics'));
        const snapshot = await get(q);

        snapshot.forEach((doc) => {
          const otherUser = doc.val();
          if (
            otherUser.uid !== user.uid && // Check by user.uid, not user.id
            otherUser.conversationTopics &&
            otherUser.conversationTopics.includes(topic) &&
            !results.some((u) => u.uid === otherUser.uid)
          ) {
            results.push(otherUser);
          }
        });
      }

      setConversationTopicResults(results);
      setLoading(false);
      return results.length > 0;
    } catch (e) {
      console.error(e);
      setError(e);
      setLoading(false);
    }
    return false;
  };

  // Function to send a message in a conversation
  const sendMessageToConversation = async (cid, content) => {
    if (!activeConversation) return;
    const now = Date.now();

    const messages = [
      ...(activeConversation.messages ?? []),
      {
        content,
        date: now,
        sender: user.id,
      },
    ];
    const dbRef = ref(Firebase.Database, `conversations/${cid}`);
    await set(dbRef, { ...activeConversation, messages });
  };

  // Function to check if a conversation request is approved
  const isApproved = (otherUserId) => {
    const cid_1 = `${otherUserId}_${user.id}`;
    const cid_2 = `${user.id}_${otherUserId}`;
    const request_1 = requests.approved[cid_1];
    const request_2 = requests.approved[cid_2];
    return request_1 || request_2;
  };

  // Function to check if a conversation request is declined
  const isDeclined = (otherUserId) => {
    const cid_1 = `${otherUserId}_${user.id}`;
    const cid_2 = `${user.id}_${otherUserId}`;
    const request_1 = requests.declined[cid_1];
    const request_2 = requests.declined[cid_2];
    return request_1 || request_2;
  };

  // Function to check if a conversation request is pending
  const isPending = (otherUserId) => {
    const cid_1 = `${otherUserId}_${user.id}`;
    const cid_2 = `${user.id}_${otherUserId}`;
    const request_1 = requests.pending[cid_1];
    const request_2 = requests.pending[cid_2];
    return {
      sender: request_1 !== undefined,
      recipient: request_2 !== undefined,
    };
  };

  return (
    <ConversationContext.Provider
      value={{
        isApproved,
        isDeclined,
        isPending,
        listUsersByConversationTopics,
        startConversation,
        listenConversation,
        getAllConversations,
        sendMessageToConversation,
        conversations,
        activeConversation,
        loading,
        error,
        requests,
        conversationTopicResults,
        approveConversationRequest,
        declineConversationRequest,
        sendConversationRequest,
      }}
    >
      {children}
    </ConversationContext.Provider>
  );
};

// Hook to use the active conversation
export const useActiveConversation = ({ route, navigation }) => {
  const { listenConversation, activeConversation, sendMessageToConversation } =
    useConversationTopicMatches();
  const [conversationLoading, setConversationLoading] = useState(true);
  const [conversationLoadingError, setConversationLoadingError] = useState();
  const { t } = useTranslation();

  // Effect to listen for changes in the active conversation
  useEffect(() => {
    const cid = route.params?.cid;
    let unsub = undefined;
    if (cid) {
      unsub = listenConversation(cid, (e) => {
        setConversationLoading(false);
        setConversationLoadingError(e);
      });
    } else {
      Alert.alert(t('No conversation ID provided'));
    }
    return () => {
      if (unsub) unsub();
    };
  }, [navigation]);
  return {
    sendMessageToConversation,
    activeConversation,
    conversationLoading,
    conversationLoadingError,
  };
};

// Hook to get all conversations of the user
export const useAllConversations = () => {
  const { user } = useAuth();
  const { getAllConversations, conversations } = useConversationTopicMatches();

  // Effect to get all conversations when user changes
  useEffect(() => {
    if (user) getAllConversations();
  }, [user]);
  return conversations;
};

// Hook to use conversation topic matches
export const useConversationTopicMatches = () => {
  const context = React.useContext(ConversationContext);
  if (!context) {
    throw new Error(
      'ConversationContext used outside of ConversationContextProvider'
    );
  }
  return context;
};
