//import React from 'react';
import React, { useState } from 'react';
import { Image,TextInput, ImageBackground, StyleSheet, Text, TouchableOpacity, View, Alert } from 'react-native';

// const Stack = createStackNavigator();

const MainScreen = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLoginPress = () => {
    navigation.navigate('MainCategories');
  };

  const handleSignUpPress = () => {
    navigation.navigate('SignUp');
  };

  return (
    <View style={styles.container}>
      <Image source={require("../assets/appLogo.jpeg")} style={styles.logo} /> 
      {/* <Text style={styles.whatRuUpToText}>What r u up to?</Text> */}
      <TextInput
        style={styles.input}
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
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
            <TouchableOpacity style={styles.socialButton} onPress={() => navigation.navigate('BigCategories')}>
                <Text style={styles.buttonText}>Sign Up with Facebook</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.socialButton} onPress={() => navigation.navigate('BigCategories')}>
                <Text style={styles.buttonText}>Sign Up with Gmail</Text>
            </TouchableOpacity>
            <Text style={styles.orText}>Don't have a User?</Text>
            <TouchableOpacity style={styles.signUpButton} onPress={handleSignUpPress}>
                <Text style={styles.buttonText}>Sign Up</Text>
            </TouchableOpacity>   
      {/* <Button title="Log In" onPress={handleLoginPress} style={styles.button} />
      <Button title="Sign Up" onPress={handleSignUpPress} style={styles.button} />
      <StatusBar style="auto" /> */}
    </View>
  );
};

// const App = () => {
//   return (
//     <NavigationContainer>
//       <Stack.Navigator>
//         <Stack.Screen name="Home" component={HomeScreen} />
//         <Stack.Screen name="SignUpDetails" component={SignUpDetailsScreen} />
//         <Stack.Screen name="MainCategoriesScreen" component={MainCategoriesScreen} />
//         <Stack.Screen name="Location" component={LocationScreen} />


//         {/* Add your Login and SignUp screens here */}
//       </Stack.Navigator>
//     </NavigationContainer>
//   );
// };

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