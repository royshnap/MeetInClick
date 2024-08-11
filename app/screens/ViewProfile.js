import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ImageBackground,
  ScrollView,
  Alert,
  TextInput,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { ref, get, set } from 'firebase/database';
import { Ionicons } from '@expo/vector-icons'; // Import Ionicons for icons
import Firebase from '../config/firebase';
import { useTranslation } from 'react-i18next';
import useSettings from '../components/useSettings';
import SettingsButton from '../components/SettingsButton';
import { Picker } from '@react-native-picker/picker'; // Import Picker

const ViewProfile = () => {
  const { t, i18n } = useTranslation();
  const [userData, setUserData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const route = useRoute();
  const navigation = useNavigation();
  const {
    backgroundImage,
    handleBackgroundChange,
    handleLanguageChange,
    handleSignOut,
  } = useSettings();
  const { userId } = route.params;

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userRef = ref(Firebase.Database, `users/${userId}`);
        const snapshot = await get(userRef);
        if (snapshot.exists()) {
          const data = snapshot.val();
          setUserData(data);
          setFormData(data); // Initialize form data with fetched data
        } else {
          Alert.alert(t('User not found'));
        }
      } catch (error) {
        Alert.alert(t('Error fetching user data'));
      }
    };
    fetchUserData();
  }, [userId]);

  const handleInputChange = (field, value) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      [field]: value,
    }));
  };

  const handleSave = async () => {
    if (formData.age < 18 || formData.age > 99) {
      Alert.alert(t('Age must be between 18 and 99'));
      return;
    }
    try {
      const userRef = ref(Firebase.Database, `users/${userId}`);
      await set(userRef, formData);
      setUserData(formData);
      setIsEditing(false);
      Alert.alert(t('Profile updated successfully'));
    } catch (error) {
      Alert.alert(t('Error updating profile'));
    }
  };

  if (!userData) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  // Determine the default image based on gender
  const defaultProfileImage = userData?.gender === 'Female' 
    ? require('../assets/defaultProfileImageWoman.png') 
    : require('../assets/defaultProfileImageMan.png');

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
            <Ionicons
              name='notifications-outline'
              size={24}
              color='black'
              style={styles.icon}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setIsEditing(!isEditing)}>
            <Ionicons
              name='create-outline'
              size={24}
              color='black'
              style={styles.icon}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.profileContainer}>
          <Image
            source={userData.profileImage ? { uri: userData.profileImage } : defaultProfileImage}
            style={styles.profileImage}
          />
        </View>
        {isEditing ? (
          <View style={styles.detailsContainer}>
            <TextInput
              style={styles.input}
              value={formData.firstName}
              onChangeText={(value) => handleInputChange('firstName', value)}
              placeholder={t('First Name')}
            />
            <TextInput
              style={styles.input}
              value={formData.lastName}
              onChangeText={(value) => handleInputChange('lastName', value)}
              placeholder={t('Last Name')}
            />
            <TextInput
              style={styles.input}
              value={formData.email}
              onChangeText={(value) => handleInputChange('email', value)}
              placeholder={t('Email')}
            />
            <TextInput
              style={styles.input}
              value={formData.username}
              onChangeText={(value) => handleInputChange('username', value)}
              placeholder={t('Username')}
            />
            <TextInput
              style={styles.input}
              value={String(formData.age)}
              onChangeText={(value) => handleInputChange('age', value)}
              placeholder={t('Age')}
              keyboardType='numeric'
            />
            <Picker
              selectedValue={formData.gender}
              style={styles.input}
              onValueChange={(itemValue) =>
                handleInputChange('gender', itemValue)
              }
            >
              <Picker.Item label="Male" value="male" />
              <Picker.Item label="Female" value="female" />
            </Picker>
            <TextInput
              style={styles.input}
              value={formData.instagram}
              onChangeText={(value) => handleInputChange('instagram', value)}
              placeholder='Instagram'
            />
            <TextInput
              style={styles.input}
              value={formData.facebook}
              onChangeText={(value) => handleInputChange('facebook', value)}
              placeholder='Facebook'
            />
            <TextInput
              style={styles.input}
              value={formData.twitter}
              onChangeText={(value) => handleInputChange('twitter', value)}
              placeholder='Twitter'
            />
            <TextInput
              style={styles.input}
              value={formData.linkedin}
              onChangeText={(value) => handleInputChange('linkedin', value)}
              placeholder='LinkedIn'
            />
            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
              <Text style={styles.saveButtonText}>{t('Save')}</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.detailsContainer}>
            <Text style={styles.detail}>
              {t('Full Name')}: {userData.firstName} {userData.lastName}
            </Text>
            <Text style={styles.detail}>
              {t('Email')}: {userData.email}
            </Text>
            <Text style={styles.detail}>
              {t('User Name')}: @{userData.username}
            </Text>
            <Text style={styles.detail}>
              {t('Age')}: {userData.age}
            </Text>
            <Text style={styles.detail}>
              {t('Gender')}: {userData.gender}
            </Text>
            {userData.instagram && (
              <Text style={styles.socialLink}>
                Instagram: {userData.instagram}
              </Text>
            )}
            {userData.facebook && (
              <Text style={styles.socialLink}>
                Facebook: {userData.facebook}
              </Text>
            )}
            {userData.twitter && (
              <Text style={styles.socialLink}>
                Twitter: {userData.twitter}
              </Text>
            )}
            {userData.linkedin && (
              <Text style={styles.socialLink}>
                LinkedIn: {userData.linkedin}
              </Text>
            )}
          </View>
        )}
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
    alignItems: 'flex-start', // Align items to the left
  },
  profileContainer: {
    alignItems: 'center', // Center the profile image horizontally
    marginBottom: 20,
  },
  profileImage: {
    width: 200,
    height: 200,
    borderRadius: 100,
    marginBottom: 20,
    marginTop: 30,
  },
  detailsContainer: {
    paddingHorizontal: 20,
    alignSelf: 'flex-start', // Align details to the left by default
  },
  detail: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: 'left', // Ensure text aligns left by default
  },
  iconsContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
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
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    width: '100%',
    borderRadius: 5, // Added border radius for rounded corners
    backgroundColor: 'white', // Added background color for inputs
  },
  saveButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
  },
  saveButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default ViewProfile;
