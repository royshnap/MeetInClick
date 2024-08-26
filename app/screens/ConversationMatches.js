import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ImageBackground,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import useSettings from '../components/useSettings';
import SettingsButton from '../components/SettingsButton';
import ConfettiCannon from 'react-native-confetti-cannon';
import MatchItem from '../components/MatchItem';
import UserDetailsModal from '../components/UserDetailsModal';
import { useFilteredMatches } from '../hooks/useFilteredMatches';
import { useMatchSections } from '../hooks/useMatchSections';
import { ref, onValue } from 'firebase/database';
import Firebase from '../config/firebase';
import { addMatchNotification } from '../context/notification';
import HorizontalList from '../components/HorizontalList';


const ConversationMatches = ({ route, navigation }) => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const {
    backgroundImage,
    handleBackgroundChange,
    handleLanguageChange,
    handleSignOut,
  } = useSettings();

  const [conversationTopicResults, setConversationTopicResults] = useState([]);
  const [showConfetti, setShowConfetti] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const { ageRange, genderPreference } = route.params || {};

  // Fetch and filter users from Firebase
  useEffect(() => {
    if (user) {
      const usersRef = ref(Firebase.Database, 'users');
      const listener = onValue(usersRef, (snapshot) => {
        const results = [];
        snapshot.forEach((childSnapshot) => {
          const otherUser = childSnapshot.val();
          if (
            otherUser.id !== user.id && // Exclude the current user
            otherUser.conversationTopics &&
            user.conversationTopics &&
            user.conversationTopics.some((topic) =>
              otherUser.conversationTopics.includes(topic)
            )
          ) {
            results.push(otherUser);
          }
        });
        setConversationTopicResults(results);

        // Add match notifications for users who match the criteria
        results.forEach((matchedUser) => {
          addMatchNotification(matchedUser.id, user.username);
        });
      });
      return () => listener(); // Cleanup the listener on unmount
    }
  }, [user]);

  // Prepare filters for the hook
  const filters = {
    ageRange: ageRange || [18, 120],
    genderPreference: genderPreference || 'Both',
  };

  // Use hooks to filter and categorize matches
  const filteredMatches = useFilteredMatches(
    conversationTopicResults,
    user,
    filters
  );
  const { newMatches, ongoingConversations } =
    useMatchSections(filteredMatches);

  const handleMatchPress = (user) => {
    setSelectedUser(user);
    setModalVisible(true);
  };

  useEffect(() => {
    if (newMatches.length > 0) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 5000);
    }
  }, [newMatches]);

  return (
    <ImageBackground source={backgroundImage} style={styles.background}>
      <View style={styles.container}>
        <SettingsButton
          onBackgroundChange={handleBackgroundChange}
          onLanguageChange={handleLanguageChange}
          onSignOut={() => handleSignOut(navigation)}
        />
        {showConfetti && (
          <ConfettiCannon
            count={200}
            origin={{ x: -10, y: 0 }}
            style={styles.confetti}
          />
        )}

        {/* New Matches */}
        <HorizontalList
          data={newMatches}
          renderItem={({ item: otherUser }) => (
            <MatchItem
              otherUser={otherUser}
              navigation={navigation}
              onPress={handleMatchPress}
            />
          )}
          headerTitle={t('New Matches')}
          emptyMessage={t('There are no matches')}
        />

        {/* Chats */}
        <HorizontalList
          data={ongoingConversations}
          renderItem={({ item }) => (
            <MatchItem
              otherUser={item}
              navigation={navigation}
              onPress={handleMatchPress}
            />
          )}
          headerTitle={t('Chats')}
          emptyMessage={t('There are no chats')}
        />

        {/* User Details Modal */}
        <UserDetailsModal
          visible={modalVisible}
          user={selectedUser}
          onClose={() => setModalVisible(false)}
        />
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  container: {
    flex: 1,
  },
  confetti: {
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: 9999,
  },
});

export default ConversationMatches;
