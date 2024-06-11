import { createContext, useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import { Alert } from 'react-native';

const SettingsContext = createContext();

export const SettingsProvider = ({ children }) => {
  const { t, i18n } = useTranslation();
  const { signOutUser } = useAuth();
  const [backgroundImage, setBackgroundImage] = useState(require('../assets/b1.jpg'));

  const handleBackgroundChange = (background) => {
    setBackgroundImage(background);
  };

  const handleLanguageChange = () => {
    const newLanguage = i18n.language === 'en' ? 'he' : 'en';
    i18n.changeLanguage(newLanguage);
  };

  const handleSignOut = async (navigation) => {
    try {
      await signOutUser();
      navigation.navigate('Main');
    } catch (error) {
      console.error('Error signing out:', error);
      Alert.alert(t('Error signing out. Please try again.'));
    }
  };

  return (
    <SettingsContext.Provider value={{ backgroundImage, handleBackgroundChange, handleLanguageChange, handleSignOut }}>
      {children}
    </SettingsContext.Provider>
  );
};

const useSettings = () => useContext(SettingsContext);

export default useSettings;

