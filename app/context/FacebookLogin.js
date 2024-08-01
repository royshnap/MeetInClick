import * as Facebook from 'expo-auth-session/providers/facebook';
import { getAuth, FacebookAuthProvider, signInWithCredential } from 'firebase/auth';
import React, { createContext, useContext, useEffect } from 'react';
import { Alert } from 'react-native';

const FacebookLoginContext = createContext();

export const FacebookLoginProvider = ({ children }) => {
  const [request, response, promptAsync] = Facebook.useAuthRequest({
    clientId: '468740272218826', // Replace with your Facebook App ID
    redirectUri: 'https://meetinclick.firebaseapp.com/__/auth/handler', // Firebase redirect URI
    scopes: ['public_profile', 'email'],
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

// import * as Facebook from 'expo-auth-session/providers/facebook';
// import { makeRedirectUri } from 'expo-auth-session';
// import { getAuth, FacebookAuthProvider, signInWithPopup } from 'firebase/auth';
// import React, { createContext, useContext, useEffect, useState } from 'react';
// import { Alert } from 'react-native';

// const FacebookLoginContext = createContext();

// export const FacebookLoginProvider = ({ children }) => {
//   const [request, response, promptAsync] = Facebook.useAuthRequest({
//     clientId: '468740272218826', 
//     redirectUri: makeRedirectUri({
//       useProxy: true,
//       native: 'https://meetinclick.firebaseapp.com/__/auth/handler', // Ensure this matches the one in your Facebook Developer Console
//     }),
//   });

//   useEffect(() => {
//     if (response?.type === 'success') {
//       const { access_token } = response.params;
//       const auth = getAuth();
//       const credential = FacebookAuthProvider.credential(access_token);
//       signInWithPopup(auth, credential).catch((error) => {
//         Alert.alert('Facebook Login Error', error.message);
//       });
//     }
//   }, [response]);

//   return (
//     <FacebookLoginContext.Provider value={{ promptAsync }}>
//       {children}
//     </FacebookLoginContext.Provider>
//   );
// };

// export const useFacebookLogin = () => {
//   return useContext(FacebookLoginContext);
// };
