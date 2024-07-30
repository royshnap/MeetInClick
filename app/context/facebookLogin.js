import * as Facebook from 'expo-auth-session/providers/facebook';
import { makeRedirectUri } from 'expo-auth-session';
import {
  getAuth,
  FacebookAuthProvider,
  signInWithCredential,
} from 'firebase/auth';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { Alert } from 'react-native';

const FacebookLoginContext = createContext();

export const FacebookLoginProvider = ({ children }) => {
  const [request, response, promptAsync] = Facebook.useAuthRequest({
    clientId: '468740272218826', // Replace with your Facebook App ID
    redirectUri: makeRedirectUri({
      useProxy: true,
      native: 'https://auth.expo.io/@yossimorsi669/meetinclick', // Ensure this matches the one in your Facebook Developer Console
    }),
  });

  useEffect(() => {
    if (response?.type === 'success') {
      const { access_token } = response.params;
      const auth = getAuth();
      const credential = FacebookAuthProvider.credential(access_token);
      signInWithCredential(auth, credential).catch((error) => {
        Alert.alert('Facebook Login Error', error.message);
      });
    }
  }, [response]);

  return (
    <FacebookLoginContext.Provider value={{ promptAsync }}>
      {children}
    </FacebookLoginContext.Provider>
  );
};

export const useFacebookLogin = () => {
  return useContext(FacebookLoginContext);
};
