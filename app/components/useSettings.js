import { createContext, useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import { Alert } from 'react-native';
import Firebase from '../config/firebase'; // Import the configured Firebase
import { ref, update } from 'firebase/database'; // Import update function to modify database

const SettingsContext = createContext();

export const SettingsProvider = ({ children }) => {
  const { t, i18n } = useTranslation();
  const { signOutUser, user } = useAuth(); // Get the current user
  const [backgroundImage, setBackgroundImage] = useState(require('../assets/b2.jpg'));

  const handleBackgroundChange = (background) => {
    setBackgroundImage(background);
  };

  const handleLanguageChange = () => {
    const newLanguage = i18n.language === 'en' ? 'he' : 'en';
    i18n.changeLanguage(newLanguage);
  };

  const handleSignOut = async (navigation) => {
    try {
      if (user) {
        const db = Firebase.Database;
        const userRef = ref(db, `users/${user.id}`);

        // Remove conversationTopics and mainCategory from the user's data
        await update(userRef, {
          conversationTopics: null, // Set to null to remove the field
          mainCategory: null,       // Set to null to remove the field
        });

        // Proceed to sign out the user
        await signOutUser(navigation);
      }
      navigation.navigate('Main');
    } catch (error) {
      console.error('Error signing out:', error);
      Alert.alert(t('Error signing out. Please try again.'));
    }
  };

  return (
    <SettingsContext.Provider
      value={{
        backgroundImage,
        handleBackgroundChange,
        handleLanguageChange,
        handleSignOut,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

const useSettings = () => useContext(SettingsContext);

export default useSettings;
