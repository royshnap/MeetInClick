import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ImageBackground } from 'react-native';
import useSettings from '../components/useSettings';


const WelcomeBack = ({ route, navigation }) => {
    const { username, mainCategory, conversationTopics } = route.params;
    const { backgroundImage } = useSettings();


    return (
        <ImageBackground source={backgroundImage} style={styles.background}>
        <View style={styles.overlay}>
            <Text style={styles.welcomeText}>Welcome Back, {username}!</Text>

          <Text style={styles.mainCategoryText}>

                Your main category is:
            </Text>
            <Text style={styles.highlight}>{mainCategory}</Text>

            <Text style={styles.subCategoryText}>

                Your subcategories are:
            </Text>
            <Text style={styles.highlight}>{conversationTopics}</Text>
    
            <TouchableOpacity
                    style={styles.smallButton}
                    onPress={() => navigation.navigate('Preferences')}
                >
                    <Text style={styles.smallButtonText}>Change Main Category</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.smallButton}
                    onPress={() => navigation.navigate('Filter')}
                >
                    <Text style={styles.smallButtonText}>Change Filters</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.largeButton}
                    onPress={() => navigation.navigate('Matches')}
                >
                    <Text style={styles.largeButtonText}>Go to Matches</Text>
                </TouchableOpacity>
        </View>
        </ImageBackground>

      );
    };
    
    const styles = StyleSheet.create({
        background: {
            flex: 1,
            width: '100%',
            height: '100%',
        },
        overlay: {
            flex: 1,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            justifyContent: 'flex-start',
            alignItems: 'center',
            paddingTop: 140,
            paddingHorizontal: 10,
        },
      welcomeText: {
        fontSize: 27,
        fontWeight: 'bold',
        color: 'black',
        marginBottom: 40,
        textAlign: 'center',
      },
      mainCategoryText: {
        fontSize: 20,
        color: 'black',
        marginBottom: 10,
        textAlign: 'center',
      },
      subCategoryText: {
        fontSize: 20,
        color: 'black',
        marginBottom: 10,
        textAlign: 'center',
      },
      highlight: {
        fontSize: 23,
        color: 'blue', // Blue color for highlighting
        fontWeight: 'bold',
        marginBottom: 30,
      },
      smallButton: {
        backgroundColor: '#007AFF', // Blue button background
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 8,
        marginVertical: 5,
        width: '60%', // Button width
        alignItems: 'center',
    },
    smallButtonText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: 'bold',
    },
    largeButton: {
        backgroundColor: '#FF5733', // Highlighted button background
        paddingVertical: 15,
        paddingHorizontal: 30,
        borderRadius: 8,
        marginVertical: 20,
        width: '80%', // Button width
        alignItems: 'center',
    },
    largeButtonText: {
        color: '#fff',
        fontSize: 26,
        fontWeight: 'bold',
    },
    });
    

export default WelcomeBack;
