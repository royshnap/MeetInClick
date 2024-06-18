import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ImageBackground,
  StyleSheet,
  Alert,
  Image,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useAuth } from "../context/AuthContext";
import { useCurrentLocation } from "../context/LocationContext";
import useSettings from '../components/useSettings';
import { useTranslation } from 'react-i18next';
import SettingsButton from '../components/SettingsButton';
import * as ImagePicker from "expo-image-picker";

const SignUpScreen = ({ navigation }) => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [profileImage, setProfileImage] = useState(null);
  const [instagram, setInstagram] = useState("");
  const [facebook, setFacebook] = useState("");
  const [twitter, setTwitter] = useState("");
  const [showSocialLinks, setShowSocialLinks] = useState(false);
  const { backgroundImage, handleBackgroundChange, handleLanguageChange, handleSignOut } = useSettings();
  const { user, register, loading, error, setError } = useAuth();
  const { hasLocationPermissions, requestLocationPermissions, currentLocation } = useCurrentLocation();
  const { t } = useTranslation();

  const handleSignUp = async () => {
    try {
      // Check if passwords match and location permissions are granted
      if (password !== confirmPassword) {
        Alert.alert('Error', 'Passwords do not match');
        return;
      }
      if (!hasLocationPermissions) {
        Alert.alert('You must give location permissions to use the app');
        await requestLocationPermissions();
        return;
      }
  
      await register({
        firstName,
        lastName,
        email,
        username,
        password,
        currentLocation,
        profileImage,
        // instagram: instagram || '',
        // facebook: facebook || '',
        // twitter: twitter || '',
      });

      Alert.alert('Sign Up Success', 'You have successfully signed up!');

    } catch (error) {
      console.error('Error signing up:', error);
      Alert.alert('Sign Up Error', 'An error occurred during sign up. Please try again.');
    }
  };
  

  useEffect(() => {
    if (error) {
      if (typeof error === "string") {
        Alert.alert(error);
      } else {
        Alert.alert(error.message);
      }
    }
  }, [error]);

  useEffect(() => {
    setError(undefined);
  }, []);

  useEffect(() => {
    if (user) {
      // user logged in
      navigation.navigate("MainCategories");
    }
  }, [user]);

  const pickImage = async () => {
    let result = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (result.granted === false) {
      Alert.alert("Permission to access media library is required!");
      return;
    }
    let pickerResult = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!pickerResult.canceled) {
      setProfileImage(pickerResult.assets[0].uri); // Ensure correct URI is set
    }
  };
 
  return (
    <ImageBackground source={backgroundImage} style={styles.background}>
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
      <SettingsButton 
          onBackgroundChange={handleBackgroundChange}
          onLanguageChange={handleLanguageChange}
          onSignOut={() => handleSignOut(navigation)} // Pass navigation here
      />
        <Text style={styles.title}>{t("Welcome To ")}MeetInClick</Text>
        <TouchableOpacity onPress={pickImage}>
          {profileImage ? (
            <Image source={{ uri: profileImage }} style={styles.profileImage} />
          ) : (
            <View style={styles.imagePlaceholder}>
              <Text style={styles.imagePlaceholderText}>{t("Pick an image")}</Text>
            </View>
          )}
        </TouchableOpacity>
        <TextInput
          style={styles.input}
          placeholder={t("First Name")}
          value={firstName}
          onChangeText={setFirstName}
        />
        <TextInput
          style={styles.input}
          placeholder={t("Last Name")}
          value={lastName}
          onChangeText={setLastName}
        />
        <TextInput
          style={styles.input}
          placeholder={t("Email")}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />
        <TextInput
          style={styles.input}
          placeholder={t("Username")}
          value={username}
          onChangeText={setUsername}
        />
        <TextInput
          style={styles.input}
          placeholder={t("Password")}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        <TextInput
          style={styles.input}
          placeholder={t("Confirm Password")}
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
        />
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setShowSocialLinks(!showSocialLinks)}
        >
          <Text style={styles.addButtonText}>{t("Add Social Network Link")}</Text>
        </TouchableOpacity>
        {showSocialLinks && (
          <>
            <TextInput
              style={styles.input}
              placeholder="Instagram Link"
              value={instagram}
              onChangeText={setInstagram}
            />
            <TextInput
              style={styles.input}
              placeholder="Facebook Link"
              value={facebook}
              onChangeText={setFacebook}
            />
            <TextInput
              style={styles.input}
              placeholder="Twitter Link"
              value={twitter}
              onChangeText={setTwitter}
            />
          </>
        )}
        <TouchableOpacity style={styles.button} onPress={handleSignUp}>
          <Text style={styles.buttonText}>{t("Sign Up")}</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
    </ImageBackground>

  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  settingsItem: {
    marginBottom: 40,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 20,
  },
  title: {
    fontSize: 27,
    fontWeight: "bold",
    marginBottom: 7,
    marginTop: 30,
  },
  input: {
    width: "80%",
    height: 50,
    borderWidth: 1,
    borderColor: "black",
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  button: {
    width: "80%",
    height: 50,
    backgroundColor: "#007AFF",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    marginBottom: 20,
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  profileImage: {
    width: 130,
    height: 130,
    borderRadius: 50,
    marginBottom: 10,
  },
  imagePlaceholder: {
    width: 130,
    height: 130,
    borderRadius: 65,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "gray",
    marginBottom: 10,
  },
  imagePlaceholderText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  addButton: {
    width: "80%",
    height: 50,
    backgroundColor: "#007AFF",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    marginBottom: 10,
  },
  addButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default SignUpScreen;
