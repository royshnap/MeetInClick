import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ImageBackground, ScrollView, Alert, TextInput } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { ref, get, onValue, set } from 'firebase/database';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useTranslation } from 'react-i18next';  // Import useTranslation
import Firebase from '../config/firebase';
import { useAuth } from '../context/AuthContext';
import useSettings from '../components/useSettings';

const ViewProfile = () => {
  const { t } = useTranslation();  // Initialize translation hook
  const { user } = useAuth();
  const [userData, setUserData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [showMoreDetails, setShowMoreDetails] = useState(false);
  const route = useRoute();
  const { backgroundImage } = useSettings();

  const userId = route.params?.userId || user?.id;

  useEffect(() => {
    const fetchUserData = async () => {
      if (!userId) return;

      try {
        const userRef = ref(Firebase.Database, `users/${userId}`);
        const snapshot = await get(userRef);
        if (snapshot.exists()) {
          const data = snapshot.val();
          setUserData(data);
          setFormData(data);
        } else {
          //Alert.alert(t('User not found'));
        }
      } catch (error) {
        Alert.alert(t('Error fetching user data'));
      }
    };
    fetchUserData();
  }, [userId]);

  useEffect(() => {
    const userRef = ref(Firebase.Database, `users/${userId}`);

    const unsubscribe = onValue(userRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        setUserData(data);
        setFormData(data);
      } else {
        //Alert.alert(t('User not found'));
      }
    });

    return () => unsubscribe();
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

  const handlePickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission denied', 'Sorry, we need camera roll permissions to make this work!');
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      const { uri } = result.assets[0];
      handleUploadImage(uri);
    }
  };

  const handleUploadImage = async (uri) => {
    try {
      const response = await fetch(uri);
      const blob = await response.blob();

      const storage = getStorage();
      const imageRef = storageRef(storage, `profileImages/${userId}.jpg`);

      await uploadBytes(imageRef, blob);
      const downloadURL = await getDownloadURL(imageRef);

      setFormData((prevFormData) => ({
        ...prevFormData,
        profileImage: downloadURL,
      }));
    } catch (error) {
      Alert.alert('Error uploading image', error.message);
    }
  };

  const defaultProfileImage =
    userData?.gender === 'Female'
      ? require('../assets/defaultProfileImageWoman.png')
      : require('../assets/defaultProfileImageMan.png');

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
        <View style={styles.iconsContainer}>
          <TouchableOpacity onPress={() => setIsEditing(!isEditing)}>
            <Ionicons name='create-outline' size={28} color='black' style={styles.icon} />
          </TouchableOpacity>
        </View>
        <View style={styles.profileContainer}>
          <TouchableOpacity onPress={isEditing ? handlePickImage : undefined}>
            <Image
              source={
                isEditing && formData.profileImage
                  ? { uri: formData.profileImage }
                  : userData.profileImage
                  ? { uri: userData.profileImage }
                  : defaultProfileImage
              }
              style={styles.profileImage}
            />
          </TouchableOpacity>
          {isEditing && (
            <Text style={styles.editImageText}>{t('Edit Profile Picture')}</Text>
          )}
        </View>
        {isEditing ? (
          <View style={styles.detailsContainer}>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>{t('First Name')}</Text>
              <TextInput
                style={styles.input}
                value={formData.firstName}
                onChangeText={(value) => handleInputChange('firstName', value)}
                placeholder={t('First Name')}
              />
            </View>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>{t('Last Name')}</Text>
              <TextInput
                style={styles.input}
                value={formData.lastName}
                onChangeText={(value) => handleInputChange('lastName', value)}
                placeholder={t('Last Name')}
              />
            </View>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>{t('Email')}</Text>
              <TextInput
                style={styles.input}
                value={formData.email}
                onChangeText={(value) => handleInputChange('email', value)}
                placeholder={t('Email')}
              />
            </View>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>{t('Age')}</Text>
              <TextInput
                style={styles.input}
                value={String(formData.age)}
                onChangeText={(value) => handleInputChange('age', value)}
                placeholder={t('Age')}
                keyboardType='numeric'
              />
            </View>
            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
              <Text style={styles.saveButtonText}>{t('Save')}</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.detailsContainer}>
            <View style={styles.userInfoContainer}>
              <Text style={styles.detail}>
                <Text style={styles.mainText}>{t('Username')}:</Text> @{userData.username}
              </Text>
              <Text style={styles.detail}>
                <Text style={styles.mainText}>{t('Age')}:</Text> {userData.age}
              </Text>
            </View>
            <TouchableOpacity onPress={() => setShowMoreDetails(!showMoreDetails)}>
              <Text style={styles.showMoreText}>
                {showMoreDetails ? t('Show Less') : t('See More Personal Details')}
              </Text>
            </TouchableOpacity>
            {showMoreDetails && (
              <View>
                <Text style={styles.moreDetail}>
                  {t('Full Name')}: {userData.firstName} {userData.lastName}
                </Text>
                <Text style={styles.moreDetail}>
                  {t('Email')}: {userData.email}
                </Text>
                <Text style={styles.moreDetail}>
                  {t('Gender')}: {t(userData.gender)}
                </Text>
              </View>
            )}
            <Text style={styles.mainCategoryText}>{t('Your main category is:')}</Text>
            <Text style={styles.highlight}>{t(userData.mainCategory)}</Text>

            <Text style={styles.subCategoryText}>{t('Your subcategories are:')}</Text>
            <View>
              {userData?.conversationTopics?.length > 0 ? (
                userData.conversationTopics.map((topic, index) => (
                  <Text key={index} style={styles.highlight}>
                    {t(topic)}{index < userData.conversationTopics.length - 1 && ' '}
                  </Text>
                ))
              ) : (
                <Text style={styles.highlight}>{t('No subcategories available')}</Text>
              )}
            </View>
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
    paddingVertical: 90,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  profileContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  profileImage: {
    width: 200,
    height: 200,
    borderRadius: 100,
  },
  userInfoContainer: {
    flexDirection: 'column',
    alignSelf: 'center',
    alignItems: 'center',
    width: '100%',
  },
  detail: {
    fontSize: 16,
    alignSelf: 'center',
    color: '#333',
    flex: 1,
  },
  mainText: {
    fontSize: 20,
    color: 'black',
    marginBottom: 20,
    fontWeight: 'bold',
    marginRight: 40,
  },
  detailsContainer: {
    paddingHorizontal: 20,
    alignSelf: 'center',
  },
  moreDetail: {
    fontSize: 18,
    alignSelf: 'center',
    color: 'black',
  },
  mainCategoryText: {
    fontSize: 24,
    color: 'black',
    marginBottom: 10,
    marginTop: 30,
    alignSelf: 'center',
    fontWeight: 'bold',
  },
  subCategoryText: {
    fontSize: 24,
    color: 'black',
    marginBottom: 10,
    alignSelf: 'center',
    fontWeight: 'bold',
  },
  highlight: {
    fontSize: 23,
    color: 'blue',
    fontWeight: 'bold',
    alignSelf: 'center',
    marginBottom: 30,
  },
  editImageText: {
    textAlign: 'center',
    fontWeight: 'bold',
    marginTop: 10,
    fontSize: 20,
    color: '#007AFF',
  },
  showMoreText: {
    fontSize: 16,
    color: '#007AFF',
    alignSelf: 'center',
    marginVertical: 10,
  },
  inputGroup: {
    marginBottom: 5,
  },
  inputLabel: {
    fontSize: 18,
    alignSelf: 'center',
    fontWeight: 'bold',
    marginBottom: 5,
    color: 'black',
  },
  input: {
    height: 30,
    borderColor: 'gray',
    borderWidth: 1,
    paddingHorizontal: 10,
    alignSelf: 'center',
    width: '150%',
    borderRadius: 5,
    backgroundColor: 'white',
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
  iconsContainer: {
    alignSelf: 'flex-end',
    marginTop: 20,
  },
  icon: {
    marginHorizontal: 10,
  },
});

export default ViewProfile;
