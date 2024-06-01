import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useAuth } from '../context/AuthContext'; // Import the useAuth hook

const MainCategoriesScreen = ({ navigation }) => {
    const [selectedCategory, setSelectedCategory] = useState('');
    const { signOutUser } = useAuth(); // Get the signOutUser function from the useAuth hook

    const handleChooseCategory = (category) => {
        setSelectedCategory(category);
    };

    const handleChooseButton = () => {
        if (selectedCategory) {
            navigation.navigate('SubCategories', { category: selectedCategory });
        } else {
            Alert.alert('Please select a category');
        }
    };

    const handleSignOut = async () => {
        try {
            await signOutUser(); // Await the sign-out process
            navigation.navigate('Main'); // Navigate to the Main screen after signing out
        } catch (error) {
            console.error('Error signing out:', error);
            Alert.alert('Error signing out. Please try again.');
        }
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
                <Text style={styles.signOutButtonText}>Sign Out</Text>
            </TouchableOpacity>
            <Text style={styles.title}>What would u like to do?</Text>
            <ScrollView style={styles.scrollView} contentContainerStyle={styles.contentContainer}>
                <TouchableOpacity onPress={() => handleChooseCategory('Conversation')}>
                    <Text style={[styles.category, selectedCategory === 'Conversation' && styles.selectedCategory]}>Conversation</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleChooseCategory('Sport Activity')}>
                    <Text style={[styles.category, selectedCategory === 'Sport Activity' && styles.selectedCategory]}>Sport Activity</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleChooseCategory('Travel')}>
                    <Text style={[styles.category, selectedCategory === 'Travel' && styles.selectedCategory]}>Travel</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleChooseCategory('Clubbing')}>
                    <Text style={[styles.category, selectedCategory === 'Clubbing' && styles.selectedCategory]}>Clubbing</Text>
                </TouchableOpacity>
                {/* Add more categories here */}
            </ScrollView>
            <TouchableOpacity style={styles.chooseButton} onPress={handleChooseButton}>
                <Text style={styles.chooseButtonText}>Select</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        paddingTop: 50, // Added padding to ensure content doesn't overlap with the absolute positioned button
    },
    title: {
        marginTop: 20, // Added margin to position the title under the sign-out button
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    scrollView: {
        width: '80%',
    },
    contentContainer: {
        alignItems: 'center',
    },
    category: {
        backgroundColor: 'white',
        borderRadius: 10,
        marginBottom: 10,
        paddingVertical: 20,
        paddingHorizontal: 40,
        color: 'black',
        fontSize: 18,
        fontWeight: 'bold',
    },
    selectedCategory: {
        backgroundColor: 'lightblue', // Changed highlight color to light blue
    },
    chooseButton: {
        marginTop: 60, // Increased the margin top to make it higher
        backgroundColor: '#007AFF',
        borderRadius: 10,
        paddingVertical: 15,
        paddingHorizontal: 30,
        marginBottom: 20,
    },
    chooseButtonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
    signOutButton: {
        position: 'absolute',
        top: 10,
        right: 10,
    },
    signOutButtonText: {
        color: 'blue',
        fontSize: 16,
    },
});


export default MainCategoriesScreen;
