import React from 'react';
import { Image, ImageBackground, StyleSheet, Text, TouchableOpacity, View, Alert } from 'react-native';
import colors from '../config/colors';

function WelcomeScreen(props) {
    const handleLoginPress = () => {
        Alert.alert('Alert', 'been clicked!');
    };

    return (
        <ImageBackground 
            style={styles.background}
           // source={require('../assets/meet.jpg')}
        >
            <View style={styles.logoContainer}>
                <Image style={styles.logo} source={require("../assets/meetinclickLogo.png")}/>
                <Text>
                    <Text style={{ color: 'red' }}>NOT</Text> a dating app
                </Text>
            </View>
            <TouchableOpacity style={styles.loginButton} onPress={handleLoginPress}>
                <Text style={styles.loginText}>Login</Text>
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
        backgroundColor: 'blue',
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
        width: 100,
        height: 100, 
    },
    logoContainer: {
        position: "absolute",
        top: 70,
        alignItems: "center"
    },
})

export default WelcomeScreen;
