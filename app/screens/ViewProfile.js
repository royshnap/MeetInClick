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
import { ref, get, set, onValue } from 'firebase/database';
import { Ionicons } from '@expo/vector-icons'; // Import Ionicons for icons
import Firebase from '../config/firebase';
import { useTranslation } from 'react-i18next';
import useSettings from '../components/useSettings';
import SettingsButton from '../components/SettingsButton';

const ViewProfile = () => {
  const { t } = useTranslation();
  const [userData, setUserData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [hasNewNotification, setHasNewNotification] = useState(false); // State to track new notifications
  const [notifications, setNotifications] = useState([]); // State to manage notification content
  const [showNotification, setShowNotification] = useState(false); // State to control notification visibility
  const route = useRoute();
  const navigation = useNavigation();
  const {
    backgroundImage,
    handleBackgroundChange,
    handleLanguageChange,
    handleSignOut,
  } = useSettings();
  const { userId } = route.params;

  // Updated markNotificationAsRead function
  const markNotificationAsRead = async () => {
    const notificationsRef = ref(Firebase.Database, `notification/${userId}`);
    await set(notificationsRef, null); // Clear the notifications after user closes the container
  };

  // Handle notification button press
  const handleNotificationPress = () => {
    setShowNotification(!showNotification); // Toggle the notification container

    if (!showNotification) {
      setShowNotification(true); // Show the notification container
    } else {
      markNotificationAsRead(); // Mark as read and hide the container when closing
    }
  };

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

  useEffect(() => {
    const notificationsRef = ref(Firebase.Database, `notification/${userId}`);
    const unsubscribe = onValue(notificationsRef, (snapshot) => {
      if (snapshot.exists()) {
        const notificationsData = snapshot.val();
        const allNotifications = [];

        if (notificationsData.newMatches) {
          allNotifications.push({
            type: 'newMatches',
            content: `You have a new match with ${notificationsData.newMatches.userName}`,
            timestamp: notificationsData.newMatches.timestamp,
          });
        }

        if (notificationsData.newMessages) {
          allNotifications.push({
            type: 'newMessages',
            content: `You have a new message from ${notificationsData.newMessages.userName}`,
            timestamp: notificationsData.newMessages.timestamp,
          });
        }

        // Sort notifications by timestamp
        allNotifications.sort((a, b) => b.timestamp - a.timestamp);

        setNotifications(allNotifications);
        setHasNewNotification(allNotifications.length > 0);
      } else {
        setHasNewNotification(false);
        setNotifications([]);
      }
    });

    return () => unsubscribe(); // Cleanup listener on unmount
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
          <TouchableOpacity onPress={handleNotificationPress} style={styles.notificationIconContainer}>
            <Ionicons
              name={hasNewNotification ? 'notifications' : 'notifications-outline'}
              size={24}
              color={hasNewNotification ? 'orange' : 'black'}
              style={styles.icon}
            />
            {hasNewNotification && (
              <View style={styles.notificationBadge}>
                <Text style={styles.notificationBadgeText}>{notifications.length}</Text>
              </View>
            )}
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
              <Text style={styles.inputLabel}>{t('Username')}</Text>
              <TextInput
                style={styles.input}
                value={formData.username}
                onChangeText={(value) => handleInputChange('username', value)}
                placeholder={t('Username')}
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
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Instagram</Text>
              <TextInput
                style={styles.input}
                value={formData.instagram}
                onChangeText={(value) => handleInputChange('instagram', value)}
                placeholder='Instagram'
              />
            </View>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Facebook</Text>
              <TextInput
                style={styles.input}
                value={formData.facebook}
                onChangeText={(value) => handleInputChange('facebook', value)}
                placeholder='Facebook'
              />
            </View>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Twitter</Text>
              <TextInput
                style={styles.input}
                value={formData.twitter}
                onChangeText={(value) => handleInputChange('twitter', value)}
                placeholder='Twitter'
              />
            </View>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>LinkedIn</Text>
              <TextInput
                style={styles.input}
                value={formData.linkedin}
                onChangeText={(value) => handleInputChange('linkedin', value)}
                placeholder='LinkedIn'
              />
            </View>
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
              {t('Username')}: @{userData.username}
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
        {/* Notification Container - Updated */}
        {showNotification && notifications.length > 0 && (
          <View style={styles.notificationDropdown}>
            {notifications.map((notification, index) => (
              <Text key={index} style={styles.notificationText}>{notification.content}</Text>
            ))}
            <TouchableOpacity onPress={handleNotificationPress}>
              <Text style={styles.closeButton}>Close</Text>
            </TouchableOpacity>
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
  marginBottom: 5,
  marginTop: 20,
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
  inputGroup: {
      marginBottom: 5, // Space between input fields
    },
    inputLabel: {
      fontSize: 14,
      marginBottom: 5, // Space between label and input field
      color: 'black', // Label color
    },
    input: {
      height: 30,
      borderColor: 'gray',
      borderWidth: 1,
      paddingHorizontal: 10,
      width: '150%',
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
    iconsContainer: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
      width: '100%',
      paddingRight: 30,
    },
    icon: {
      marginHorizontal: 10,
    },
    notificationIconContainer: {
      position: 'relative',
    },
    notificationBadge: {
      position: 'absolute',
      top: -5,
      right: -10,
      backgroundColor: 'red',
      borderRadius: 10,
      width: 20,
      height: 20,
      justifyContent: 'center',
      alignItems: 'center',
    },
    notificationBadgeText: {
      color: 'white',
      fontSize: 12,
      fontWeight: 'bold',
    },
    notificationDropdown: {
      position: 'absolute',
      top: 50,
      right: 30,
      backgroundColor: '#f1c40f',
      borderRadius: 10,
      padding: 10,
      width: 200,
      maxHeight: 150,
    },
    notificationText: {
      fontSize: 16,
      color: '#2c3e50',
      marginBottom: 10,
    },
    closeButton: {
      color: '#e74c3c',
      fontSize: 14,
    },
});

export default ViewProfile;