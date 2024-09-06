import React, { useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  Alert,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useConversationTopicMatches } from '../context/ConversationContext';
import { useAuth } from '../context/AuthContext';

const MatchItem = ({ otherUser, navigation, onPress }) => {
  const { t } = useTranslation();
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
      const conversationId = await startConversation(
        otherUser.id,
        requestId_1,
        requestId_2
      );
      if (conversationId) {
        navigation.navigate('Conversation', { cid: conversationId });
      } else {
        Alert.alert(
          t('There was a problem starting conversation with {{username}}', {
            username: otherUser.username,
          })
        );
      }
    } catch (e) {
      Alert.alert(e.message);
    }
  };

  const handlePressSendRequest = async () => {
    try {
      const conversationId = await sendConversationRequest(otherUser.id);
      if (conversationId) {
        // Using interpolation to insert the username into the translated string
        //Alert.alert(t('Request has been sent to {{username}}', { username: otherUser.username }));
      } else {
        // Using interpolation to insert the username into the translated string
        Alert.alert(
          t('There was a problem sending conversation request to {{username}}', { username: otherUser.username })
        );
      }
    } catch (e) {
      Alert.alert(t('An error occurred: {{errorMessage}}', { errorMessage: e.message }));
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
        style={[
          styles.startConversationButton,
          {
            backgroundColor: approved
              ? '#4CAF50'
              : sender
              ? '#BDBDBD'
              : 'transparent',
          },
        ]}
        disabled={!sender && !approved}
        onPress={() => handlePressStartConversation(cid1, cid2)}
      >
        <Text
          style={{
            color:
              approved || sender ? '#FFFFFF' : declined ? '#F44336' : '#9E9E9E',
          }}
        >
          {t('Enter Chat')}
        </Text>
      </TouchableOpacity>
    );

    if (approved) {
      return (
        <View>
          <StartConversationButton />
        </View>
      );
    } else if (declined) {
      return (
        <View>
          <Text style={styles.statusText}>{t('Status: Declined')}</Text>
          <StartConversationButton />
        </View>
      );
    } else if (sender || recipient) {
      return (
        <View>
          <Text style={styles.statusText}>{t('Status: Pending')}</Text>
          <StartConversationButton />
        </View>
      );
    }
    return (
      <View>
        <TouchableOpacity
          style={styles.button}
          onPress={handlePressSendRequest}
        >
          <Text style={styles.buttonText}>{t('Send request')}</Text>
        </TouchableOpacity>
      </View>
    );
  }, [requests]);

  // Determine profile image to show
  const profileImage = otherUser.profileImage
    ? { uri: otherUser.profileImage }
    : otherUser.gender === 'Female'
    ? require('../assets/defaultProfileImageWoman.png')
    : require('../assets/defaultProfileImageMan.png');

  return (
    <TouchableOpacity
      style={styles.matchItem}
      onPress={() => onPress(otherUser)}
    >
      <Image source={profileImage} style={styles.profilePicture} />
      <View style={styles.matchItemTextContainer}>
        <Text style={styles.matchText}>{otherUser.username}</Text>
        <Status />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  matchItem: {
    backgroundColor: 'transparent',
    borderRadius: 25,
    padding: 6,
    marginBottom: 10,
    flexDirection: 'column',
    alignItems: 'center',
    shadowColor: 'transparent',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  matchItemTextContainer: {
    alignItems: 'center',
  },
  matchText: {
    fontSize: 20,
    color: 'black',
    fontWeight: 'bold',
    marginTop: 5,
  },
  button: {
    padding: 12,
    borderRadius: 5,
    backgroundColor: '#2196F3',
    alignItems: 'center',
    marginTop: 10,
  },
  startConversationButton: {
    padding: 7,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  statusText: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  profilePicture: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
});

export default MatchItem;
