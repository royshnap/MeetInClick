import React from 'react';
import { Image, ImageBackground, StyleSheet, Text, TouchableOpacity, View, Alert } from 'react-native';

function WelcomeScreen({ navigation }) {
    const handleLoginPress = () => {
        navigation.navigate('Login');
    };

    return (
        <ImageBackground 
            style={styles.background}
            // source={require('../assets/meet.jpg')}
        >
            <View style={styles.logoContainer}>
                <Image style={styles.logo} source={require("../assets/logoBrown.png")}/>
                <Text>
                    <Text style={{ color: 'red', fontSize: 30 }}>NOT</Text> 
                    <Text style={{ fontSize: 25 }}> a dating app</Text>
                </Text>
            </View>
            <TouchableOpacity style={styles.loginButton} onPress={handleLoginPress}>
                <Text style={styles.loginText}>Start</Text>
            </TouchableOpacity>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    background: {
        flex: 1,
        justifyContent: "flex-end",
        alignItems: "center",
    },
    loginButton: {
        width: 120, // Adjust the width as needed
        height: 40, // Adjust the height as needed
        backgroundColor: '#007AFF',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 20, // Adjust the borderRadius to make it more rounded
        marginBottom: 20, // Adjust the marginBottom as needed
    },
    loginText: {
        color: 'white',
        fontSize: 18, // Adjust the fontSize as needed
        fontWeight: 'bold',
    },
    logo: {
        width: 300, // Change the width to make the logo bigger
        height: 200, // Change the height to make the logo bigger
    },
    logoContainer: {
        position: "absolute",
        top: 70,
        alignItems: "center"
    },
})

export default WelcomeScreen;
