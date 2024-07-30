import React from 'react';
import { TouchableOpacity, Text, StyleSheet, Alert } from 'react-native';
import * as Facebook from 'expo-facebook';

const FacebookLogin = () => {
  const handleFacebookLogin = async () => {
    try {
      await Facebook.initializeAsync({
        appId: '468740272218826',
      });
      const result = await Facebook.logInWithReadPermissionsAsync({
        permissions: ['public_profile', 'email'],
      });

      if (result.type === 'success') {
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
    <TouchableOpacity style={styles.button} onPress={handleFacebookLogin}>
      <Text style={styles.buttonText}>Log in with Facebook</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#3b5998',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 5,
    width: '70%',
  },
  buttonText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default FacebookLogin;
