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
            <Text style={styles.title}>What would you like to do?</Text>
            <ScrollView style={styles.scrollView} contentContainerStyle={styles.contentContainer}>
                <TouchableOpacity style={styles.categoryButton} onPress={() => handleChooseCategory('Conversation')}>
                    <Text style={[styles.categoryText, selectedCategory === 'Conversation' && styles.selectedCategoryText]}>Conversation</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.categoryButton} onPress={() => handleChooseCategory('Sport Activity')}>
                    <Text style={[styles.categoryText, selectedCategory === 'Sport Activity' && styles.selectedCategoryText]}>Sport Activity</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.categoryButton} onPress={() => handleChooseCategory('Travel')}>
                    <Text style={[styles.categoryText, selectedCategory === 'Travel' && styles.selectedCategoryText]}>Travel</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.categoryButton} onPress={() => handleChooseCategory('Clubbing')}>
                    <Text style={[styles.categoryText, selectedCategory === 'Clubbing' && styles.selectedCategoryText]}>Clubbing</Text>
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
        justifyContent: 'flex-start',
        alignItems: 'center',
        paddingTop: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#333',
    },
    scrollView: {
        width: '100%',
    },
    contentContainer: {
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    categoryButton: {
        width: '100%',
        maxWidth: 300,
        backgroundColor: 'white',
        borderRadius: 15,
        marginBottom: 10,
        paddingVertical: 20,
        paddingHorizontal: 40,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 2,
        elevation: 5,
    },
    categoryText: {
        color: 'black',
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    selectedCategoryText: {
        backgroundColor: 'lightblue',
    },
    chooseButton: {
        marginTop: 60,
        backgroundColor: '#2EE411',
        borderRadius: 10,
        paddingVertical: 15,
        paddingHorizontal: 30,
        marginBottom: 20,
        alignItems: 'center',
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
        color: '#07D7EF',
        fontSize: 16,
    },
});

export default MainCategoriesScreen;
