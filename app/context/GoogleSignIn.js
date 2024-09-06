import React, { useEffect, useState } from 'react';
import { TouchableOpacity, Text, StyleSheet, Image, Alert } from 'react-native';
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import {
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithCredential,
} from 'firebase/auth';
import Firebase from '../config/firebase';
import { ref, get, set } from 'firebase/database';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

WebBrowser.maybeCompleteAuthSession();

const GoogleSignIn = () => {
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [request, response, promptAsync] = Google.useAuthRequest({
    iosClientId:
      '595812871102-orhd01f1kuktrbr7ea053sphln6ordh7.apps.googleusercontent.com',
    androidClientId:
      '595812871102-sf6v5bui4fm3nquunc1dpr68sha7eb72.apps.googleusercontent.com',
    webClientId:
      '1010390116818-e75jsc1fa7m0b4ko02e05dvasmpobbe7.apps.googleusercontent.com',
  });

  const navigation = useNavigation(); 

  const checkLocalUser = async () => {
    try {
      setLoading(true);
      const userJSON = await AsyncStorage.getItem('@user');
      const userData = userJSON ? JSON.parse(userJSON) : null;
      //console.log('local user data', userData);
      setUserInfo(userData);
    } catch (e) {
      alert(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (response?.type === 'success') {
      const { id_token } = response.params;
      const credential = GoogleAuthProvider.credential(id_token); // Correctly using GoogleAuthProvider
      signInWithCredential(Firebase.Auth, credential); // Firebase.Auth should be passed here
    }
  }, [response]);

  useEffect(() => {
    checkLocalUser();

    const unsub = onAuthStateChanged(Firebase.Auth, async (user) => {
      if (user) {
        const isGoogleSignIn = user.providerData.some(
          (provider) => provider.providerId === 'google.com'
        );

        // Only handle Google sign-in users here
        if (isGoogleSignIn) {
          console.log(
            'User signed in via Google:',
            JSON.stringify(user, null, 2)
          );
          setUserInfo(user);
          await AsyncStorage.setItem('@user', JSON.stringify(user));

          const userRef = ref(Firebase.Database, `users/${user.uid}`);
          const snapshot = await get(userRef);

          if (!snapshot.exists() || !snapshot.val().age) {
            navigation.replace('AdditionalUserInfo');
          } else {
            navigation.navigate('Preferences');
          }
        }
      } else {
        //console.log('user is not authenticated');
      }
    });

    return () => unsub();
  }, []);

  return (
    <TouchableOpacity style={styles.googleButton} onPress={() => promptAsync()}>
      <Image
        source={require('../assets/google-icon.png')}
        style={styles.googleIcon}
      />
      <Text style={styles.googleButtonText}>Log in with Google</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    padding: 10,
    borderRadius: 5,
    borderColor: '#D3D3D3',
    borderWidth: 1,
    width: '80%',
    alignSelf: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
    elevation: 2,
    marginBottom: 20,
  },
  googleButtonText: {
    color: '#000000',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  googleIcon: {
    width: 24,
    height: 24,
  },
});

export default GoogleSignIn;
