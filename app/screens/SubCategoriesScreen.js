import React, { useState } from 'react';
import { View, Text, TextInput, FlatList, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const SubCategoriesScreen = () => {
    const navigation = useNavigation();
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [isCategorySelected, setIsCategorySelected] = useState(false);
    const categories = [
        "Travel", "Books", "Music", "Movies", "Hobbies", "Food", "Technology", "Career",
        "Childhood", "Health", "Relationships", "Culture", "Fashion", "Goals", "Politics",
        "Psychology", "News", "Sports", "Business", "Art", "Philosophy", "Nature", "Social",
        "Education", "Funny", "Achievements", "Languages", "Pets", "Science", "Dreams",
        "Traditions", "Concerts", "Inspiration", "Finance", "Vacations", "Quotes",
        "Fitness", "Adventure", "Creativity"
    ];

    const handleSearch = (query) => {
        setSearchQuery(query);
    };

    const handleSelectCategory = (category) => {
        setSelectedCategory(category);
        setIsCategorySelected(true);
    };

    const handleSelectButton = () => {
        if (isCategorySelected) {
            Alert.alert(
                `You chose the topic: ${selectedCategory}`,
                '',
                [
                    { text: 'Back', onPress: () => console.log('Back pressed'), style: 'cancel', },
                    {text: 'OK',onPress: () => navigation.navigate('Location', { category: selectedCategory })}
                ]
            );
        } else {
            Alert.alert('Please select a topic.');
        }
    };

    const filteredCategories = categories.filter(category =>
        category.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <View style={styles.container}>
            <TextInput
                style={styles.input}
                placeholder="Search category..."
                value={searchQuery}
                onChangeText={handleSearch}
            />
            <FlatList
                data={filteredCategories}
                renderItem={({ item }) => (
                    <TouchableOpacity onPress={() => handleSelectCategory(item)}>
                        <Text style={[styles.category, selectedCategory === item && styles.selectedCategory]}>{item}</Text>
                    </TouchableOpacity>
                )}
                keyExtractor={(item) => item}
            />
            <TouchableOpacity style={styles.selectButton} onPress={handleSelectButton}>
                <Text style={styles.buttonText}>Select</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 10,
        marginBottom: 20,
        paddingHorizontal: 10,
    },
    category: {
        fontSize: 18,
        marginBottom: 10,
    },
    selectedCategory: {
        backgroundColor: 'lightblue',
        borderRadius: 5,
        paddingHorizontal: 5,
    },
    selectButton: {
        width: '80%',
        height: 50,
        backgroundColor: '#007AFF',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
        marginTop: 20,
    },
    buttonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default SubCategoriesScreen;
