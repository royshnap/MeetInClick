import React from 'react';
import { TouchableOpacity, Text, StyleSheet, Alert } from 'react-native';
import * as Google from 'expo-auth-session/providers/google';
import firebase from '../config/firebase';
import 'firebase/auth';
import 'firebase/firestore';

const GoogleSignIn = () => {
  const [request, response, promptAsync] = Google.useAuthRequest({
    expoClientId: '63eb3457-b53f-4a3b-8c0f-04d8e653773f',
    iosClientId: '793761719542-obfbf3g0u2e95r4sbj88l4j6erg20lfs.apps.googleusercontent.com',
    androidClientId: '793761719542-4ibctgdab9mb5t69va7q7uohaolu9bvl.apps.googleusercontent.com',
    webClientId: '793761719542-5dfr6olefnlj5h4hur9bl1qmahv4rh50.apps.googleusercontent.com',
  });

  React.useEffect(() => {
    if (response?.type === 'success') {
      const { id_token } = response.params;
      const credential = firebase.auth.GoogleAuthProvider.credential(id_token);
      firebase.auth().signInWithCredential(credential)
        .then(async (userCredential) => {
          const { user } = userCredential;
          await addUserToDatabase(user);
        })
        .catch((error) => {
          Alert.alert('Authentication error', error.message);
        });
    }
  }, [response]);

  const addUserToDatabase = async (user) => {
    const { email, displayName } = user;
    const userRef = firebase.firestore().collection('users').doc(user.uid);
    const doc = await userRef.get();
    if (!doc.exists) {
      await userRef.set({
        email,
        displayName,
      });
    }
  };

  return (
    <TouchableOpacity style={styles.button} onPress={() => promptAsync()}>
      <Text style={styles.buttonText}>Log in with Google</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#4285F4',
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

export default GoogleSignIn;
