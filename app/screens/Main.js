import React, { useEffect, useState } from 'react';
import {
  Image,
  TextInput,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Alert,
  Modal,
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import GoogleSignIn from '../context/GoogleSignIn';
//import { useFacebookLogin } from '../context/FacebookLogin';
import CustomScrollView from '../components/CustomScrollView';
import { ref, get } from "firebase/database";
import Firebase from "../config/firebase";
import WelcomeBack from './WelcomeBack';


const MainScreen = ({ navigation }) => {
  const { t, i18n } = useTranslation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { user, login, error, setError } = useAuth();
  const [settingsVisible, setSettingsVisible] = useState(false); // State for settings modal visibility
  //const { promptAsync } = useFacebookLogin();


  const handleLoginPress = async () => {
    try {
      await login(email, password);
    } catch (e) {
      console.error(e); 
    }
  };

  //const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const handleSignUpPress = () => {
    navigation.navigate('SignUp');
  };

  useEffect(() => {
    const checkUserCategories = async () => {
      if (user) {
        const userRef = ref(Firebase.Database, `users/${user.id}`);
        const snapshot = await get(userRef);
        if (snapshot.exists()) {
          const userData = snapshot.val();
          if (userData.mainCategory && userData.conversationTopics) {
            navigation.navigate('AppTabs', { screen: 'Profile'});
          } else {
            navigation.replace('Preferences');
          }
        }
      }
    };

    checkUserCategories();
  }, [user]);


  useEffect(() => {
    if (error)
      if (typeof error === 'string') Alert.alert(error);
      else Alert.alert(error.message);
  }, [error]);

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
    <CustomScrollView>
      <Image source={require('../assets/LOGO7.png')} style={styles.logo} />
      <TextInput
        style={styles.input}
        placeholder={t('Email address')}
        value={email}
        onChangeText={setEmail}
      />
      <TouchableOpacity
        style={styles.settingsButton}
        onPress={toggleSettingsModal}
      >
        <Ionicons name='settings-outline' size={32} color='black' />
      </TouchableOpacity>
      <Modal
        animationType='slide'
        transparent={true}
        visible={settingsVisible}
        onRequestClose={() => setSettingsVisible(false)}
      >
        <View style={styles.settingsModal}>
          <View style={styles.settingsContent}>
            {/* Your settings UI components */}
            <TouchableOpacity
              style={styles.closeButton}
              onPress={toggleSettingsModal}
            >
              <Ionicons name='close-circle' size={24} color='black' />
            </TouchableOpacity>
            {/* Language selection */}
            <View style={styles.section}>
              <TouchableOpacity
                style={styles.languageButton}
                onPress={changeLanguage}
              >
                <Text style={styles.languageButtonText}>
                  {t('Change Language')}
                </Text>
              </TouchableOpacity>
            </View>
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
      {/* <FacebookLogin />  */}
      {/* <View>
        <Button title='Login with Facebook' onPress={() => promptAsync()} />
      </View> */}
      <GoogleSignIn />
      <Text style={styles.orText}>{t("Don't have a User?")}</Text>
      <TouchableOpacity style={styles.signUpButton} onPress={handleSignUpPress}>
        <Text style={styles.buttonText}>{t('Sign Up')}</Text>
      </TouchableOpacity>
      <View style={{ height: 50 }} />
    </CustomScrollView>
  );
};
const styles = StyleSheet.create({
  //   background: {
  //     flex: 1,
  //     width: '100%',
  //     height: '100%',
  //   },
  //   container: {
  //     flex: 1,
  //     justifyContent: 'flex-start',
  //     alignItems: 'center',
  //     backgroundColor: 'transparent',
  //     paddingTop: 5,
  //   },

  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#F2F2CC',
    paddingTop: 5,
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
    width: '70%',
    backgroundColor: '#FFFFFF',
    padding: 40,
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
    width: 420,
    height: 420,
    marginBottom: 10,
  },
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
  languageButton: {
    backgroundColor: '#3b5998',
    borderRadius: 15,
    padding: 15,
  },
  languageButtonText: {
    fontSize: 16,
    color: 'white',
  },
  button: {
    marginVertical: 5,
  },
});

export default MainScreen;
