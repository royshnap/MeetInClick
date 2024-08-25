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
import { useFilteredMatches } from '../hooks/useFilteredMatches'; // Filtering logic
import { useMatchSections } from '../hooks/useMatchSections'; // Categorization logic
import { ref, onValue } from 'firebase/database';
import Firebase from '../config/firebase';
import { addMatchNotification } from '../context/notification';

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

        {/* Display new matches */}
        {newMatches.length > 0 ? (
          <>
            <Text style={styles.sectionHeader}>{t('New Matches')}:</Text>
            <FlatList
              data={newMatches}
              renderItem={({ item: otherUser }) => (
                <MatchItem
                  otherUser={otherUser}
                  navigation={navigation}
                  onPress={handleMatchPress}
                />
              )}
              keyExtractor={(item) => item.id}
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.horizontalMatches}
              contentContainerStyle={{ alignItems: 'flex-start' }} // Align items to the top
            />
          </>
        ) : (
          <Text style={styles.noMatchesOrChatsText}>
            {t('There are no matches')}
          </Text>
        )}

        {/* Display ongoing conversations */}
        <Text style={styles.sectionHeader}>{t('Chats')}:</Text>
        {ongoingConversations.length > 0 ? (
          <FlatList
            data={ongoingConversations}
            renderItem={({ item: otherUser }) => (
              <MatchItem
                otherUser={otherUser}
                navigation={navigation}
                onPress={handleMatchPress}
              />
            )}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.horizontalMatches}
            contentContainerStyle={{ alignItems: 'flex-start' }} // Align items to the top
          />
        ) : (
          <Text style={styles.noMatchesOrChatsText}>
            {t('There are no chats')}
          </Text>
        )}

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
    resizeMode: 'cover', // Ensure the image covers the entire background
  },
  matchItem: {
    backgroundColor: 'transparent',
    borderRadius: 25,
    padding: 10, // Reduced padding from 20
    marginBottom: 10, // Reduced margin from 15
    flex: 1, // Allow items to take up available space equally
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
    color: '#333333',
    fontWeight: 'bold',
    marginTop: 5, // Adjusted for consistency
  },
  row: {
    justifyContent: 'space-between', // Ensure items are evenly spaced in each row
  },
  horizontalMatches: {
    paddingHorizontal: 5, // Adjust to reduce extra padding
  },
  noMatchesOrChatsText: {
    fontSize: 18,
    marginBottom: 20,
    marginTop: 20,
    textAlign: 'center',
    color: '#F44336', // Red color for "no matches" or "no chats" text
  },
  sectionHeader: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 10,
    marginLeft: 10,
    color: '#2e2934',
  },
});

export default ConversationMatches;
