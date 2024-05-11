import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Alert } from 'react-native';

const MainCategoriesScreen = ({ navigation }) => {
    const [selectedCategory, setSelectedCategory] = useState('');

    const handleChooseCategory = (category) => {
        setSelectedCategory(category);
    };

    const handleChooseButton = () => {
        if (selectedCategory) {
            if (selectedCategory === 'Conversation') {
                Alert.alert(`You chose ${selectedCategory}`, '', [
                    { text: 'Back', onPress: () => console.log('Back pressed'), style: 'cancel', },
                    { text: 'OK', onPress: () => navigation.navigate('SubCategories', { category: selectedCategory }) },
                ]);
            } else {
                Alert.alert(`You chose ${selectedCategory}`, '', [
                    { text: 'Back', onPress: () => console.log('Back pressed'), style: 'cancel', },
                    { text: 'OK', onPress: () => navigation.navigate('Location', { category: selectedCategory }) },
                ]);
            }
        } else {
            Alert.alert('Please select a category');
        }
    };

    return (
        <View style={styles.container}>
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
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
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
    },
    chooseButtonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default MainCategoriesScreen;
