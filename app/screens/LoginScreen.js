import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const LoginScreen = ({ navigation }) => {
    const handleFacebookLogin = () => {
        // Implement Facebook login logic
        // After successful login, navigate to the LocationScreen
        navigation.navigate('Location');
    };

    const handleInstagramLogin = () => {
        // Implement Instagram login logic
        // After successful login, navigate to the LocationScreen
        navigation.navigate('Location');
    };

    const handleGoogleLogin = () => {
        // Implement Google login logic
        // After successful login, navigate to the LocationScreen
        navigation.navigate('Location');
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Login</Text>
            <TouchableOpacity style={styles.button} onPress={handleFacebookLogin}>
                <Text style={styles.buttonText}>Login with Facebook</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={handleInstagramLogin}>
                <Text style={styles.buttonText}>Login with Instagram</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={handleGoogleLogin}>
                <Text style={styles.buttonText}>Login with Gmail</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
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
    buttonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default LoginScreen;
