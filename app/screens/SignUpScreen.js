import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useAuth } from "../context/AuthContext";
import { useCurrentLocation } from "../context/LocationContext";
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

  const { user, register, loading, error, setError } = useAuth();
  const { hasLocationPermissions, requestLocationPermissions, currentLocation } = useCurrentLocation();

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
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.title}>Welcome To MeetInClick</Text>
        <TouchableOpacity onPress={pickImage}>
          {profileImage ? (
            <Image source={{ uri: profileImage }} style={styles.profileImage} />
          ) : (
            <View style={styles.imagePlaceholder}>
              <Text style={styles.imagePlaceholderText}>Pick an image</Text>
            </View>
          )}
        </TouchableOpacity>
        <TextInput
          style={styles.input}
          placeholder="First Name"
          value={firstName}
          onChangeText={setFirstName}
        />
        <TextInput
          style={styles.input}
          placeholder="Last Name"
          value={lastName}
          onChangeText={setLastName}
        />
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />
        <TextInput
          style={styles.input}
          placeholder="Username"
          value={username}
          onChangeText={setUsername}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        <TextInput
          style={styles.input}
          placeholder="Confirm Password"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
        />
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setShowSocialLinks(!showSocialLinks)}
        >
          <Text style={styles.addButtonText}>Add Social Network Link</Text>
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
          <Text style={styles.buttonText}>Sign Up</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFE12A",
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    width: "80%",
    height: 50,
    borderWidth: 1,
    borderColor: "gray",
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
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 20,
  },
  imagePlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "gray",
    marginBottom: 20,
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
