import { ref, query, orderByChild, equalTo, get, update, set, onValue } from "firebase/database";

import Firebase from "../config/firebase";
import { useEffect, useState } from "react";
import { useAuth } from "./AuthContext";
import React from "react";
import { mapFirebaseResults, mapFirebaseResultsDict } from "../../utils";

const ConversationContext = React.createContext(null);

export const ConversationContextProvider = ({ children }) => {
  const { user } = useAuth();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(undefined);
  const [requests, setRequests] = useState({
    pending: {},
    approved: {},
    declined: {},
  });
  const [conversationTopicResults, setConversationTopicResults] = useState([]);
  const [conversations, setConversations] = useState(undefined);
  const [activeConversation, setActiveConversation] = useState(undefined);

  const getAllConversations = async (refresh = false) => {
    if (!refresh && conversations) {
      return; // No need to refresh existing conversations..
    }
    setLoading(true);
    try {
      const dbRef = ref(Firebase.Database, `conversations`);
      const allUsersMap = await get(ref(Firebase.Database, "users")).then(mapFirebaseResultsDict);

      const [result_1, result_2] = Promise.all(
        get(query(dbRef, orderByChild("user_1"), equalTo(user.id))).then(mapFirebaseResults),
        get(query(dbRef, orderByChild("user_2"), equalTo(user.id))).then(mapFirebaseResults)
      );
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
      setError(e);
    } finally {
      setLoading(false);
    }
  };

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

  const startConversation = async (otherUserId, requestId_1, requestId_2) => {
    setLoading(true);
    try {
      if(!isApproved(otherUserId)) {
        await approveConversationRequest(requestId_1)
        await approveConversationRequest(requestId_2)
      }
        
      const cid_1 = `${user.id}_${otherUserId}`;
      const cid_2 = `${otherUserId}_${user.id}`;

      const dbRefU1 = ref(Firebase.Database, `conversations/${cid_1}`);
      const dbRefU2 = ref(Firebase.Database, `conversations/${cid_2}`);
      const existing_1 = await get(dbRefU1);
      const existing_2 = await get(dbRefU2);

      if (existing_1.exists() || existing_2.exists()) {
        // conversation is already present for those 2 users
        setLoading(false);
        if (existing_1.exists()) return cid_1;
        else return cid_2;
      }

      await set(dbRefU1, {
        cid_1,
        messages: [],
        user_1: user.id,
        user_2: otherUserId,
      });
      return cid_1;
    } catch (e) {
      setError(error);
    } finally {
      setLoading(false);
    }
    return null;
  };

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
        // request is already present for those 2 users
        // approve it
        setLoading(false);
        if (existing_1.exists()) {
          await update(dbRefU1, { status: "approved" });
          return cid_1;
        } else {
          await update(dbRefU2, { status: "approved" });
          return cid_2;
        }
      }

      await set(dbRefU1, {
        cid_1,
        status: "pending",
        user_1: user.id,
        user_2: otherUserId,
      });
      return cid_1;
    } catch (e) {
      setError(error);
    } finally {
      setLoading(false);
    }
    return null;
  };

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
        mapping[request["status"]][request.cid_1] = request;
      }
      setRequests(mapping);
    });
    return unsub;
  };

  const declineConversationRequest = async (requestId) => {
    const dbRefU1 = ref(Firebase.Database, `requests/${requestId}`);
    await update(dbRefU1, { status: "declined" });
  };

  const approveConversationRequest = async (requestId) => {
    const dbRefU1 = ref(Firebase.Database, `requests/${requestId}`);
    await update(dbRefU1, { status: "approved" });
  };

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
          if (
            otherUser.id !== user.id &&
            otherUser.conversationTopics &&
            otherUser.conversationTopics.includes(topic) &&
            !results.some((u) => u.id === otherUser.id)
          ) {
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

  const isApproved = (otherUserId) => {
    const cid_1 = `${otherUserId}_${user.id}`;
    const cid_2 = `${user.id}_${otherUserId}`;
    const request_1 = requests.approved[cid_1];
    const request_2 = requests.approved[cid_2];
    return request_1 || request_2;
  };
  const isDeclined = (otherUserId) => {
    const cid_1 = `${otherUserId}_${user.id}`;
    const cid_2 = `${user.id}_${otherUserId}`;
    const request_1 = requests.declined[cid_1];
    const request_2 = requests.declined[cid_2];
    return request_1 || request_2;
  };
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

export const useActiveConversation = ({ route, navigation }) => {
  //added navigation
  const { listenConversation, activeConversation, sendMessageToConversation } =
    useConversationTopicMatches();
  const [conversationLoading, setConversationLoading] = useState(true);
  const [conversationLoadingError, setConversationLoadingError] = useState();

  useEffect(() => {
    const cid = route.params?.cid;
    let unsub = undefined;
    if (cid) {
      unsub = listenConversation(cid, (e) => {
        // this function executes whenver there are changes in conversation
        setConversationLoading(false);
        setConversationLoadingError(e);
      });
    } else {
      Alert.aelrt;
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

export const useAllConversations = () => {
  const { user } = useAuth();
  const { getAllConversations, conversations } = useConversationTopicMatches();

  useEffect(() => {
    if (user) getAllConversations();
  }, [user]);
  return conversations;
};

export const useConversationTopicMatches = () => {
  const context = React.useContext(ConversationContext);
  if (!context) {
    throw new Error("ConversationContext used outside of ConversationContextProvider");
  }
  return context;
};
