import React, { useEffect, useState } from "react";
import {View,Text,TextInput,TouchableOpacity,ImageBackground,StyleSheet,Alert,Image,ScrollView,KeyboardAvoidingView,Platform,} from "react-native";
import { useAuth } from "../context/AuthContext";
import { useCurrentLocation } from "../context/LocationContext";
import useSettings from '../components/useSettings';
import { useTranslation } from 'react-i18next';
import SettingsButton from '../components/SettingsButton';
import * as ImagePicker from "expo-image-picker";
import DateTimePicker from '@react-native-community/datetimepicker';
import Firebase from "../config/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import uuid from 'react-native-uuid';

const SignUpScreen = ({ navigation }) => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [gender, setGender] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [instagram, setInstagram] = useState("");
  const [facebook, setFacebook] = useState("");
  const [twitter, setTwitter] = useState("");
  const [showSocialLinks, setShowSocialLinks] = useState(false);
  const { backgroundImage, handleBackgroundChange, handleLanguageChange, handleSignOut } = useSettings();
  const { user, register, loading, error, setError } = useAuth();
  const { hasLocationPermissions, requestLocationPermissions, currentLocation } = useCurrentLocation();
  const { t } = useTranslation();

  const minAge = 18; // Minimum age requirement
  const maxAge = 120;
  const calculateAge = (dob) => {
    const today = new Date();
    const birthDate = new Date(dob);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();
    if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const uploadImageAsync = async (uri) => {
    const response = await fetch(uri);
    const blob = await response.blob();
    const uniqueId = uuid.v4(); // Generate a unique ID for the image
    const imageRef = ref(Firebase.Storage, `profileImages/${uniqueId}`); // Use uniqueId here
    await uploadBytes(imageRef, blob);
    return await getDownloadURL(imageRef);
  };

  const handleSignUp = async () => {
    if (
      !firstName ||
      !lastName ||
      !email ||
      !username ||
      !password ||
      !confirmPassword ||
      !dateOfBirth ||
      !gender
    ) {
      Alert.alert('Missing fields', 'Please fill all the required fields');
      return;
    }
  
    const age = calculateAge(dateOfBirth);
    if (age < minAge || age > maxAge) {
      Alert.alert('Not at the appropriate age', `You must be between ${minAge} and ${maxAge} to sign up`);
      return;
    }
  
    if (password !== confirmPassword) {
      Alert.alert('Password problem', 'Passwords do not match');
      return;
    }
  
    if (!hasLocationPermissions) {
      Alert.alert('You must give location permissions to use the app');
      await requestLocationPermissions();
      return;
    }
  
    let profileImageUrl = '';
    if (profileImage) {
      profileImageUrl = await uploadImageAsync(profileImage);
    }
  
    try {
      await register({
        firstName,
        lastName,
        email,
        username,
        password,
        gender,
        age,
        dateOfBirth: dateOfBirth.toISOString(),
        currentLocation,
        profileImage: profileImageUrl,
      });
  
      navigation.navigate("Preferences");
    } catch (error) {
      console.error("Sign up failed:", error);
    }
  };

  useEffect(() => {
    if (error) {
      if (error.code === 'auth/invalid-email') {
        Alert.alert('Email problem', 'Please ensure you entered the correct email');
      } else {
        Alert.alert('Error', 'unknown error');
      }
    }
  }, [error]);

  useEffect(() => {
    setError(undefined);
  }, []);

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

  const showDatePickerHandler = () => {
    setShowDatePicker(true);
  };

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (selectedDate) {
      setDateOfBirth(selectedDate);
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
          <TouchableOpacity onPress={showDatePickerHandler} style={styles.input}>
            <Text>{t('Date of Birth')}: {dateOfBirth.toLocaleDateString()}</Text>
          </TouchableOpacity>
          {showDatePicker && (
            <DateTimePicker
              value={dateOfBirth}
              mode="date"
              display="default"
              onChange={handleDateChange}
            />
          )}
          <View style={styles.genderContainer}>
            <TouchableOpacity
              style={[styles.genderButton, gender === 'Male' && styles.selectedGender]}
              onPress={() => setGender('Male')}
            >
              <Text style={styles.genderText}>{t('Male')}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.genderButton, gender === 'Female' && styles.selectedGender]}
              onPress={() => setGender('Female')}
            >
              <Text style={styles.genderText}>{t('Female')}</Text>
            </TouchableOpacity>
          </View>
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
  genderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '60%',
    marginVertical: 10,
  },
  genderButton: {
      flex: 1,
      padding: 8,
      marginHorizontal: 5,
      borderWidth: 2,
      borderColor: 'black',
      borderRadius: 10,
      alignItems: 'center',
  },
  selectedGender: {
      backgroundColor: 'lightblue',
  },
  genderText: {
      fontSize: 18,
  },
  input: {
    width: "80%",
    height: 50,
    borderWidth: 2,
    borderColor: "black",
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: 10,
    justifyContent: 'center', // Center the text vertically
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
