import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useAuth } from '../context/AuthContext';

const SignUpScreen = ({ navigation }) => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const {user, register, loading,error,setError} = useAuth()

    const handleSignUp = async () => {
        // Implement sign up logic here
        // For simplicity, let's just log the form data for now
        console.log('Sign Up Data:', {
            firstName,
            lastName,
            email,
            username,
            password,
            confirmPassword,
        });
        await register({
            firstName,
            lastName,
            email,
            username,
            password
        })
    };
    useEffect(() => {
        if(error)
            if(typeof error === 'string')
                Alert.alert(error)
            else
                Alert.alert(error.message)
    },[error])

    
useEffect(() => {
    setError(undefined)
},[])
    useEffect(() => {
        if(user) { // user logged in
          navigation.navigate('MainCategories');
       }
      }, [user])

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Welcome To MeetInClick </Text>
            <TextInput
                style={styles.input}
                placeholder="First Name"
                value={firstName}
                onChangeText={setFirstName}
            />
            <TextInput
                style={styles.input}
                placeholder="Last Name"
                value={lastName}
                onChangeText={setLastName}
            />
            <TextInput
                style={styles.input}
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
            />
            <TextInput
                style={styles.input}
                placeholder="Username"
                value={username}
                onChangeText={setUsername}
            />
            <TextInput
                style={styles.input}
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
            />
            <TextInput
                style={styles.input}
                placeholder="Confirm Password"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
            />
            <TouchableOpacity style={styles.button} onPress={handleSignUp}>
                <Text style={styles.buttonText}>Sign Up</Text>
            </TouchableOpacity>
            {/* <Text style={styles.orText}>or Sign Up with</Text>
            <TouchableOpacity style={styles.socialButton} onPress={() => navigation.navigate('BigCategories')}>
                <Text style={styles.buttonText}>Sign Up with Facebook</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.socialButton} onPress={() => navigation.navigate('BigCategories')}>
                <Text style={styles.buttonText}>Sign Up with Instagram</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.socialButton} onPress={() => navigation.navigate('BigCategories')}>
                <Text style={styles.buttonText}>Sign Up with Gmail</Text>
            </TouchableOpacity> */}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FFE12A',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    input: {
        width: '80%',
        height: 50,
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 10,
        paddingHorizontal: 10,
        marginBottom: 20,
    },
    button: {
        width: '80%',
        height: 50,
        backgroundColor: '#007AFF',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
        marginBottom: 20,
    },
    socialButton: {
        width: '80%',
        height: 50,
        backgroundColor: '#3b5998', // Facebook blue color
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
        marginBottom: 20,
    },
    buttonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
    orText: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
});

export default SignUpScreen;
