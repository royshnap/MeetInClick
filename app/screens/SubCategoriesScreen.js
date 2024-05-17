import React, { useState } from 'react';
import { View, Text, TextInput, FlatList, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useConversationTopicMatches } from '../context/ConversationContext';

const SubCategoriesScreen = ({ navigation }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategories, setSelectedCategories] = useState([]);

    const {
        listUsersByConversationTopics, loading, error, conversationTopicResults
    } = useConversationTopicMatches();

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
        if (selectedCategories.includes(category)) {
            setSelectedCategories(selectedCategories.filter(c => c !== category));
        } else if (selectedCategories.length < 3) {
            setSelectedCategories([...selectedCategories, category]);
        } else {
            Alert.alert('You can select up to 3 topics.');
        }
    };

    const handleSelectButton = async () => {
        if (selectedCategories.length > 0) {
            const hasResults = await listUsersByConversationTopics(selectedCategories);
            if (hasResults) {
                navigation.navigate('ConversationMatches');
            } else {
                Alert.alert('No matches found for the selected topics.');
            }
        } else {
            Alert.alert('Please select at least one topic.');
        }
    };

    const filteredCategories = categories.filter(category =>
        category.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <View style={styles.container}>
            <Text style={styles.headline}>What would you like to talk about?</Text>
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
                        <Text style={[styles.category, selectedCategories.includes(item) && styles.selectedCategory]}>{item}</Text>
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
    headline: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
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
        alignSelf: 'center',
    },
    buttonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default SubCategoriesScreen;
