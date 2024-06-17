import React, { useCallback, useMemo, useState, useEffect } from "react";
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert, ImageBackground } from "react-native";
import { useConversationTopicMatches } from "../context/ConversationContext";
import { useAuth } from "../context/AuthContext";
import { useTranslation } from "react-i18next";
import useSettings from "../components/useSettings";
import SettingsButton from "../components/SettingsButton";
import { useCurrentLocation } from "../context/LocationContext";
import { calculateDistance } from "../utils";
import ConfettiCannon from 'react-native-confetti-cannon';

const MatchItem = ({ otherUser, navigation }) => {
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
  const { handleBackgroundChange, handleLanguageChange, handleSignOut } = useSettings(navigation);

  const handlePressStartConversation = async (requestId_1, requestId_2) => {
    try {
      const conversationId = await startConversation(otherUser.id, requestId_1, requestId_2);
      if (conversationId) {
        navigation.navigate("Conversation", { cid: conversationId });
      } else {
        Alert.alert(t("There was a problem starting conversation with", { username: otherUser.username }));
      }
    } catch (e) {
      Alert.alert(e.message);
    }
  };

  const handlePressSendRequest = async () => {
    try {
      const conversationId = await sendConversationRequest(otherUser.id);
      if (conversationId) {
        Alert.alert(t(`Request has been sent to ${otherUser.username}`));
      } else {
        Alert.alert(t(`There was a problem sending conversation request to ${otherUser.username}`));
      }
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
        style={[styles.startConversationButton, { backgroundColor: approved ? "#4CAF50" : sender ? "#BDBDBD" : "transparent" }]}
        disabled={!sender && !approved}
        onPress={() => handlePressStartConversation(cid1, cid2)}
      >
        <Text
          style={{
            color: approved || sender ? "#FFFFFF" : declined ? "#F44336" : "#9E9E9E",
          }}
        >
          {t("Start conversation")}
        </Text>
      </TouchableOpacity>
    );

    if (approved) {
      return (
        <View>
          <Text style={styles.statusText}>{t("Status: Approved")}</Text>
          <StartConversationButton />
        </View>
      );
    } else if (declined) {
      return (
        <View>
          <Text style={styles.statusText}>{t("Status: Declined")}</Text>
          <StartConversationButton />
        </View>
      );
    } else if (sender || recipient) {
      return (
        <View>
          <Text style={styles.statusText}>{t("Status: Pending")}</Text>
          <StartConversationButton />
        </View>
      );
    }
    return (
      <View>
        <TouchableOpacity style={styles.button} onPress={handlePressSendRequest}>
          <Text style={styles.buttonText}>{t("Send conversation request")}</Text>
        </TouchableOpacity>
      </View>
    );
  }, [requests]);

  return (
    <View style={styles.matchItem}>
      <View style={styles.matchItemTextContainer}>
        <Text style={styles.matchText}>{t("User name")}: {otherUser.username}</Text>
        <Text style={styles.topicsText}>{t("Topics")}: {otherUser.conversationTopics.join(", ")}</Text>
      </View>
      <Status />
    </View>
  );
};

const ConversationMatches = ({ navigation }) => {
  const { t } = useTranslation();
  const { conversationTopicResults } = useConversationTopicMatches();
  const { user } = useAuth();
  const { handleBackgroundChange, handleLanguageChange, handleSignOut } = useSettings(navigation);
  const { backgroundImage, currentLocation, interestRadius } = useCurrentLocation();

  const [showConfetti, setShowConfetti] = useState(false);

  const filteredMatches = useMemo(() => {
    const matches = conversationTopicResults.filter(otherUser => {
      if (currentLocation && otherUser.currentLocation) {
        const distance = calculateDistance(currentLocation.coords, otherUser.currentLocation.coords);
        return distance <= interestRadius;
      }
      return false;
    });
    
    if (matches.length > 0) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000); // Show confetti for 3 seconds
      matches.forEach(match => {
        console.log("Match details:", match);
      });
    }

    return matches;
  }, [conversationTopicResults, currentLocation, interestRadius]);

  return (
    <ImageBackground source={backgroundImage} style={styles.background}>
      <View style={styles.container}>
        <SettingsButton
          // onBackgroundChange={handleBackgroundChange}
          // onLanguageChange={handleLanguageChange}
          // onSignOut={handleSignOut}
          onBackgroundChange={handleBackgroundChange}
          onLanguageChange={handleLanguageChange}
          onSignOut={() => handleSignOut(navigation)}
        />
        {showConfetti && <ConfettiCannon count={200} origin={{ x: -10, y: 0 }} style={styles.confetti} />}
        {filteredMatches.length === 0 && (
          <Text style={styles.noMatchesText}>{t("No matches found for the selected topics within the specified distance.")}</Text>
        )}
        {filteredMatches.length > 0 && <Text style={styles.matchesText}>{t("Matches")}:</Text>}
        <FlatList
          data={filteredMatches}
          renderItem={({ item: otherUser }) => (
            <MatchItem otherUser={otherUser} navigation={navigation} />
          )}
          keyExtractor={(item) => item.id}
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
  },
  container: {
    flex: 1,
    position: 'relative',
  },
  confetti: {
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: 9999, // Ensure the confetti is in front of everything
  },
  noMatchesText: {
    fontSize: 18,
    marginBottom: 20,
    marginTop: 40,
    textAlign: "center",
    color: "#F44336",
  },
  matchesText: {
    fontSize: 26,
    marginBottom: 20,
    color: "#2196F3",
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 30,
  },
  matchItem: {
    backgroundColor: "#FFFFFF",
    borderRadius: 30,
    padding: 20,
    marginBottom: 15,
    marginTop: 5,
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
    fontSize: 20,
    color: "#333333",
    fontWeight: "bold",
  },
  topicsText: {
    fontSize: 15,
    color: "#666666",
  },
  button: {
    padding: 12,
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
