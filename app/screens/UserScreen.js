// UserScreen.js
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ImageBackground,
  ScrollView,
  Alert,
  I18nManager
} from "react-native";
import { useRoute } from "@react-navigation/native";
import { ref, get, onValue } from "firebase/database";
import { Ionicons } from "@expo/vector-icons"; // Import Ionicons for icons
import Firebase from "../config/firebase";
import { useTranslation } from 'react-i18next';
import useSettings from '../components/useSettings';
import SettingsButton from '../components/SettingsButton';

const UserScreen = () => { 
  const { t, i18n } = useTranslation(); 
  const [userData, setUserData] = useState(null);
  const route = useRoute();
  const { backgroundImage, handleBackgroundChange, handleLanguageChange, handleSignOut } = useSettings();
  const { userId } = route.params;

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userRef = ref(Firebase.Database, `users/${userId}`);
        const snapshot = await get(userRef);
        if (snapshot.exists()) {
          setUserData(snapshot.val());
        } else {
          Alert.alert(t("User not found"));
        }
      } catch (error) {
        Alert.alert(t("Error fetching user data"));
      }
    };
    fetchUserData();
  }, [userId]);

  if (!userData) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

return (
  <ImageBackground source={backgroundImage} style={styles.background}>
    <ScrollView contentContainerStyle={styles.container}>
      <SettingsButton 
        onBackgroundChange={handleBackgroundChange}
        onLanguageChange={handleLanguageChange}
        onSignOut={() => handleSignOut(navigation)} // Pass navigation here
      />
      <View style={styles.iconsContainer}>
        <TouchableOpacity onPress={() => null}> 
          <Ionicons name="notifications-outline" size={24} color="black" style={styles.icon} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => null}>   
          <Ionicons name="create-outline" size={24} color="black" style={styles.icon} />
        </TouchableOpacity>
      </View>
      <View style={styles.profileContainer}>
          <Image
            source={{ uri: userData.profileImage }}
            style={styles.profileImage}
          />
      </View>
      <View style={styles.detailsContainer}>
        <Text style={styles.detail}>{t("Full Name")}: {userData.firstName} {userData.lastName}</Text>
        <Text style={styles.detail}>{t("Email")}: {userData.email}</Text>
        <Text style={styles.detail}>{t("User Name")}: @{userData.username}</Text>
      {userData.instagram && (
        <Text style={styles.socialLink}>Instagram: {userData.instagram}</Text>
      )}
      {userData.facebook && (
        <Text style={styles.socialLink}>Facebook: {userData.facebook}</Text>
      )}
      {userData.twitter && (
        <Text style={styles.socialLink}>Twitter: {userData.twitter}</Text>
      )}
      </View>
    </ScrollView>
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
  flexGrow: 1,
  paddingVertical: 20,
  paddingHorizontal: 20,
  alignItems: "flex-start", // Align items to the left
},
profileContainer: {
    alignItems: "center", // Center the profile image horizontally
    marginBottom: 20,
  },
profileImage: {
  width: 200,
  height: 200,
  borderRadius: 100,
  marginBottom: 20,
  marginTop: 30
},
detailsContainer: {
  paddingHorizontal: 20,
  alignSelf: "flex-start", // Align details to the left by default
},
detail: {
  fontSize: 18,
  marginBottom: 20,
  textAlign: "left", // Ensure text aligns left by default
},
iconsContainer: {
  flexDirection: "row",
  justifyContent: "flex-end",
  width: '100%',
  paddingRight: 30,
},
icon: {
  marginHorizontal: 10,
},
socialLink: {
  fontSize: 18,
  marginBottom: 5,
},
});

export default UserScreen; 
