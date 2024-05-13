import React, { useEffect, useState } from 'react';
import { Image,TextInput, ImageBackground, StyleSheet, Text, TouchableOpacity, View, Alert } from 'react-native';
import { useAuth } from '../context/AuthContext';

const MainScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const {user, login, error, setError} = useAuth()

  const handleLoginPress = async () => {
    try {
      await login(email, password);
    } catch (e) {
      // Handle error, e.g., by setting an error state or logging
      console.error(e); // or display an alert, etc.
    }
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

  return (
    <View style={styles.container}>
      <Image source={require("../assets/appLogo.jpeg")} style={styles.logo} /> 
      {/* <Text style={styles.whatRuUpToText}>What r u up to?</Text> */}
      <TextInput
        style={styles.input}
        placeholder="Email address"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}f
        placeholder="Password"
        secureTextEntry={true}
        value={password}
        onChangeText={setPassword}
      />
       <TouchableOpacity style={styles.loginButton} onPress={handleLoginPress}>
                <Text style={styles.buttonText}>Login</Text>
            </TouchableOpacity>
            <Text style={styles.orText}>or Login with</Text>
            <TouchableOpacity style={styles.socialButton} onPress={() => navigation.navigate('MainCategories')}>
                <Text style={styles.buttonText}>Sign Up with Facebook</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.socialButton} onPress={() => navigation.navigate('MainCategories')}>
                <Text style={styles.buttonText}>Sign Up with Gmail</Text>
            </TouchableOpacity>
            <Text style={styles.orText}>Don't have a User?</Text>
            <TouchableOpacity style={styles.signUpButton} onPress={() => navigation.navigate('SignUp')}>
                <Text style={styles.buttonText}>Sign Up</Text>
      </TouchableOpacity>   
      {/* <Button title="Log In" onPress={handleLoginPress} style={styles.button} />
      <Button title="Sign Up" onPress={handleSignUpPress} style={styles.button} />
      <StatusBar style="auto" /> */}
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
  logo: {
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