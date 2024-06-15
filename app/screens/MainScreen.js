import React, { useEffect, useState } from 'react';
import { Image,TextInput, ImageBackground, StyleSheet, Text, TouchableOpacity, View, Alert, Modal } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import GoogleSignIn from '../context/GoogleSignIn';
import FacebookLogin from '../context/facebookLogin';

const MainScreen = ({ navigation }) => {
  const { t, i18n } = useTranslation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const {user, login, error, setError} = useAuth()
  const [settingsVisible, setSettingsVisible] = useState(false); // State for settings modal visibility

  const handleLoginPress = async () => {
    try {
      await login(email, password);
    } catch (e) {
      // Handle error, e.g., by setting an error state or logging
      console.error(e); // or display an alert, etc.
    }
  };

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  // Function to handle background change
  const handleBackgroundChange = () => {
    const nextIndex = (selectedImageIndex + 1) % images.length;
    setSelectedImageIndex(nextIndex);
  };

  const handleSignUpPress = () => {
    navigation.navigate('SignUp');
  };
  
  useEffect(() => {
    if(user) { // user logged in
      navigation.replace('MainCategories');
    }
  }, [user])

  useEffect(() => {
    if(error)
        if(typeof error === 'string')
            Alert.alert(error)
        else
            Alert.alert(error.message)
          
  },[error])

useEffect(() => {
  // Possible adjustment: Clear error on unmount to avoid stale state issues
  return () => {
    setError(undefined);
  };
}, []);

const changeLanguage = () => {
  const newLanguage = i18n.language === 'en' ? 'he' : 'en';
  i18n.changeLanguage(newLanguage);
};

// Toggle settings modal visibility
const toggleSettingsModal = () => {
  setSettingsVisible(!settingsVisible);
};

return (
  <View style={styles.container}>
    <Image source={require('../assets/appLogo.jpg')} style={styles.logo} />
    <TextInput
      style={styles.input}
      placeholder={t('Email address')}
      value={email}
      onChangeText={setEmail}
    />
    <TouchableOpacity style={styles.settingsButton} onPress={toggleSettingsModal}>
        <Ionicons name="settings-outline" size={32} color="black" />
    </TouchableOpacity>
    <Modal
        animationType="slide"
        transparent={true}
        visible={settingsVisible}
        onRequestClose={() => setSettingsVisible(false)}
      >
        <View style={styles.settingsModal}>
          <View style={styles.settingsContent}>
            {/* Your settings UI components */}
            <TouchableOpacity style={styles.closeButton} onPress={toggleSettingsModal}>
              <Ionicons name="close-circle" size={24} color="black" />
            </TouchableOpacity>
            {/* Language selection */}
            <TouchableOpacity style={styles.settingsItem} onPress={changeLanguage}>
              <Text>{t('Change Language')}</Text>
            </TouchableOpacity>
            {/* Other settings */}
          </View>
        </View>
    </Modal>
    <TextInput
      style={styles.input}
      placeholder={t('Password')}
      secureTextEntry={true}
      value={password}
      onChangeText={setPassword}
    />
    <TouchableOpacity style={styles.loginButton} onPress={handleLoginPress}>
      <Text style={styles.buttonText}>{t('Login')}</Text>
    </TouchableOpacity>
    <Text style={styles.orText}>{t('or Login with')}</Text>
    {/* <TouchableOpacity style={styles.socialButton} onPress={() => navigation.navigate('MainCategories')}>
      <Text style={styles.buttonText}>{t('Sign Up with Facebook')}</Text>
    </TouchableOpacity> */}
    <FacebookLogin />
    <GoogleSignIn />
    {/* <TouchableOpacity style={styles.socialButton} onPress={() => navigation.navigate('MainCategories')}>
      <Text style={styles.buttonText}>{t('Sign Up with Gmail')}</Text>
    </TouchableOpacity> */}
    <Text style={styles.orText}>{t("Don't have a User?")}</Text>
    <TouchableOpacity style={styles.signUpButton} onPress={handleSignUpPress}>
      <Text style={styles.buttonText}>{t('Sign Up')}</Text>
    </TouchableOpacity>
  
  </View>
);
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#FFE12A',
    paddingTop: 5
  },
  
  settingsButton: {
    position: 'absolute',
    top: 70,
    right: 20,
  },
  settingsModal: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  settingsContent: {
    width: '50%',
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 30,
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  settingsItem: {
    marginBottom: 40,
  },
  logo: {
    marginTop: 60,
    width: 400,
    height: 400,
    marginBottom: 10,
  },
  // whatRuUpToText: {
  //   fontSize: 24,
  //   fontWeight: 'bold',
  //   marginBottom: 70,
  // },
  input: {
    width: '80%',
    height: 35,
    borderWidth: 1,
    borderColor: 'gray',
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  loginButton: {
    width: '30%',
    height: 45,
    backgroundColor: '#2EE411', // Green color
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    marginBottom: 10,
},
socialButton: {
  width: '80%',
  height: 30,
  backgroundColor: '#3b5998', // Facebook blue color
  justifyContent: 'center',
  alignItems: 'center',
  borderRadius: 10,
  marginBottom: 10,
},
signUpButton: {
    width: '30%',
    height: 45,
    backgroundColor: '#07D7EF', 
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    marginBottom: 20,
},

  button: {
    marginVertical: 5,
  },
});

export default MainScreen;