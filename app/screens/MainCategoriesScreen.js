import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Alert, ImageBackground , Modal } from 'react-native';
import { useAuth } from '../context/AuthContext'; // Import the useAuth hook
import { useTranslation } from 'react-i18next';
import useSettings from '../components/useSettings';
import SettingsButton from '../components/SettingsButton'; // Adjust the path if necessary
//import SettingsModal from 'C:/Users/yossi/MeetInClick2/MeetInClick';
import Icon from 'react-native-vector-icons/Ionicons';


const MainCategoriesScreen = ({ navigation }) => {
    const { t, i18n } = useTranslation(); // Correctly destructure i18n
    const [selectedCategory, setSelectedCategory] = useState('');
    //const { signOutUser } = useAuth(); // Get the signOutUser function from the useAuth hook
    //const [settingsVisible, setSettingsVisible] = useState(false);
    //const [backgroundImage, setBackgroundImage] = useState(require('../assets/b1.jpg'));
    const { backgroundImage, handleBackgroundChange, handleLanguageChange, handleSignOut } = useSettings(navigation);

    const handleChooseCategory = (category) => {
        setSelectedCategory(category);
    };

    const handleChooseButton = () => {
        if (selectedCategory) {
            navigation.navigate('SubCategories', { category: selectedCategory });
        } else {
            Alert.alert(t('Please select a category'));
        }
    };

    // const handleSignOut = async () => {
    //     try {
    //         await signOutUser(); // Await the sign-out process
    //         navigation.navigate('Main'); // Navigate to the Main screen after signing out
    //     } catch (error) {
    //         console.error('Error signing out:', error);
    //         Alert.alert(t('Error signing out. Please try again.'));
    //     }
    // };
    // const handleBackgroundChange = (background) => {
    //     setBackgroundImage(background);
    //     setSettingsVisible(false);
    //   };
    
    //   const handleLanguageChange = () => {
    //     const newLanguage = i18n.language === 'en' ? 'he' : 'en';
    //     i18n.changeLanguage(newLanguage);
    //   };
    return (
        <ImageBackground source={backgroundImage} style={styles.background}>
            
            <View style={styles.overlay}>
              <SettingsButton 
                onBackgroundChange={handleBackgroundChange}
                onLanguageChange={handleLanguageChange}
                onSignOut={handleSignOut}
              />
                <Text style={styles.title}>
                    {t('What would you')}{'\n'}
                    {t('like to do?')}
                </Text>
                <ScrollView style={styles.scrollView} contentContainerStyle={styles.contentContainer}>
                    <TouchableOpacity onPress={() => handleChooseCategory('Conversation')}>
                        <Text style={[styles.category, selectedCategory === 'Conversation' && styles.selectedCategory]}>{t('Conversation')}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => handleChooseCategory('Sport Activity')}>
                        <Text style={[styles.category, selectedCategory === 'Sport Activity' && styles.selectedCategory]}>{t('Sport Activity')}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => handleChooseCategory('Travel')}>
                        <Text style={[styles.category, selectedCategory === 'Travel' && styles.selectedCategory]}>{t('Travel')}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => handleChooseCategory('Clubbing')}>
                        <Text style={[styles.category, selectedCategory === 'Clubbing' && styles.selectedCategory]}>{t('Clubbing')}</Text>
                    </TouchableOpacity>
                    {/* Add more categories here */}
                </ScrollView>
                <TouchableOpacity style={styles.chooseButton} onPress={handleChooseButton}>
                    <Text style={styles.chooseButtonText}>{t('Select')}</Text>
                </TouchableOpacity>
                {/* <TouchableOpacity style={styles.settingsButton} onPress={() => setSettingsVisible(true)}>
                 <Icon name="settings-outline" size={40} color="#000" />
                </TouchableOpacity> */}
                {/* <SettingsModal
                  visible={settingsVisible}
                  onClose={() => setSettingsVisible(false)}
                  onBackgroundChange={handleBackgroundChange}
                  onLanguageChange={handleLanguageChange}
                  onSignOut={handleSignOut} // Pass the sign out function to the modal

                /> */}
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
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent overlay for contrast
        justifyContent: 'flex-start',
        alignItems: 'center',
        paddingTop: 140,
        paddingHorizontal: 10,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 30,
        color: '#FFF', // Changed to white for better contrast with the background
        textAlign: 'center', // Center the text
        fontFamily: 'YourCustomFont', // Apply custom font
    },
    
    scrollView: {
        width: '100%',
    },
    contentContainer: {
        alignItems: 'center',
    },
 
    category: {
        backgroundColor: 'rgba(255, 255, 255, 0.8)', // Semi-transparent white background
        borderRadius: 15,
        marginBottom: 10,
        paddingVertical: 13,
        paddingHorizontal: 20,
        color: 'black',
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
        width: '80%', // Set a consistent width
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 2,
        elevation: 5,
        justifyContent: 'center', // Center text vertically
        alignItems: 'center', // Center text horizontally
    },
    selectedCategory: {
        backgroundColor: 'lightblue',
    },
    chooseButton: {
        marginTop: 60,
        backgroundColor: '#8AF326',
        borderRadius: 10,
        paddingVertical: 10,
        paddingHorizontal: 20,
        marginBottom: 40,
    },
    chooseButtonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
    
    settingsButton: {
        position: 'absolute',
        top: 10,
        right: 10,
    },
    settingsIcon: {
        width: 30,
        height: 30,
    },
});
//     return (
//         <ImageBackground source={require('../assets/back10.jpg')} style={styles.background} resizeMode="contain">
//             <View style={styles.container}>
//                 <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
//                     <Text style={styles.signOutButtonText}>Sign Out</Text>
//                 </TouchableOpacity>
//                 <Text style={styles.title}>What would you like to do?</Text>
//                 <ScrollView style={styles.scrollView} contentContainerStyle={styles.contentContainer}>
//                     <TouchableOpacity onPress={() => handleChooseCategory('Conversation')}>
//                         <Text style={[styles.category, selectedCategory === 'Conversation' && styles.selectedCategory]}>Conversation</Text>
//                     </TouchableOpacity>
//                     <TouchableOpacity onPress={() => handleChooseCategory('Sport Activity')}>
//                         <Text style={[styles.category, selectedCategory === 'Sport Activity' && styles.selectedCategory]}>Sport Activity</Text>
//                     </TouchableOpacity>
//                     <TouchableOpacity onPress={() => handleChooseCategory('Travel')}>
//                         <Text style={[styles.category, selectedCategory === 'Travel' && styles.selectedCategory]}>Travel</Text>
//                     </TouchableOpacity>
//                     <TouchableOpacity onPress={() => handleChooseCategory('Clubbing')}>
//                         <Text style={[styles.category, selectedCategory === 'Clubbing' && styles.selectedCategory]}>Clubbing</Text>
//                     </TouchableOpacity>
//                     {/* Add more categories here */}
//                 </ScrollView>
//                 <TouchableOpacity style={styles.chooseButton} onPress={handleChooseButton}>
//                     <Text style={styles.chooseButtonText}>Select</Text>
//                 </TouchableOpacity>
//             </View>
//         </ImageBackground>
//     );
// };


// const styles = StyleSheet.create({
    
//     background: {
//         flex: 1,
//         alignItems: 'center',
//         resizeMode: 'cover',
//         paddingTop: 30,
//     },
//     overlay: {
//         flex: 1,
//         backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent overlay for contrast
//         justifyContent: 'flex-start',
//         alignItems: 'center',
//         paddingTop: 20,
//     },
//     title: {
//         fontSize: 24,
//         fontWeight: 'bold',
//         marginBottom: 40,
//         color: '#333',
//     },
//     scrollView: {
//         width: '80%',
//     },
//     contentContainer: {
//         alignItems: 'center',
//     },
//     category: {
//         backgroundColor: 'white',
//         borderRadius: 15,
//         marginBottom: 10,
//         paddingVertical: 20,
//         paddingHorizontal: 40,
//         color: 'black',
//         fontSize: 20,
//         fontWeight: 'bold',
//         textAlign: 'center',
//         width: '100%',
//         shadowColor: '#000',
//         shadowOffset: { width: 0, height: 2 },
//         shadowOpacity: 0.8,
//         shadowRadius: 2,
//         elevation: 5,
//     },
//     selectedCategory: {
//         backgroundColor: 'lightblue',
//     },
//     chooseButton: {
//         marginTop: 10,
//         backgroundColor: '#2EE411',
//         borderRadius: 10,
//         paddingVertical: 10,
//         paddingHorizontal: 10,
//         marginBottom: 10,
//     },
//     chooseButtonText: {
//         color: 'white',
//         fontSize: 18,
//         fontWeight: 'bold',
//     },
//     signOutButton: {
//         position: 'absolute',
//         top: 10,
//         right: 10,
//     },
//     signOutButtonText: {
//         color: '#07D7EF',
//         fontSize: 16,
//     },
// });


export default MainCategoriesScreen;
