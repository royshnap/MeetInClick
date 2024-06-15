import React from 'react';
import { View, Button, Alert } from 'react-native';
import * as Facebook from 'expo-facebook';

const FacebookLogin = () => {
  const handleFacebookLogin = async () => {
    try {
      await Facebook.initializeAsync({
        appId: '1113204129735804',
      });
      const result = await Facebook.logInWithReadPermissionsAsync({
        permissions: ['public_profile', 'email'],
      });

      if (result.type === 'success') {
        // Get user data using Facebook's Graph API
        const response = await fetch(`https://graph.facebook.com/me?access_token=${result.token}`);
        const userData = await response.json();
        Alert.alert('Logged in!', `Hi ${userData.name}!`);
      } else {
        Alert.alert('Login cancelled!');
      }
    } catch (error) {
      Alert.alert(`Facebook Login Error: ${error.message}`);
    }
  };

  return (
    <View>
      <Button title="Login with Facebook" onPress={handleFacebookLogin} />
    </View>
  );
};

export default FacebookLogin;
