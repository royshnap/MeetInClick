import React, { useState } from 'react';
import { View, Text, TextInput, FlatList, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useConversationTopicMatches } from '../context/ConversationContext';


const SubCategoriesScreen = ({ route, navigation }) => {
    const { category } = route.params; // Get the main category from the route parameters
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategories, setSelectedCategories] = useState([]);

    const {
        listUsersByConversationTopics, loading, error, conversationTopicResults
    } = useConversationTopicMatches(); // Hook to manage conversation topic matches

    const categoriesMap = {
        Conversation: [
            "Travel", "Books", "Music", "Movies", "Hobbies", "Food", "Technology", "Career",
            "Childhood", "Health", "Relationships", "Culture", "Fashion", "Goals", "Politics",
            "Psychology", "News", "Sports", "Business", "Art", "Philosophy", "Nature", "Social",
            "Education", "Funny", "Achievements", "Anime","Netflix", "Languages", "Pets", "Science", "Dreams",
            "Traditions", "Concerts", "Inspiration", "Finance", "Vacations", "Quotes",
            "Fitness", "Adventure", "Creativity"
        ],
        "Sport Activity": [
            "Running", "Swimming", "Cycling", "Yoga", "Weightlifting", "Dancing",
            "Hiking", "Soccer", "Basketball", "Tennis", "Badminton", "Cricket",
            "Baseball", "Rugby", "Table Tennis", "Volleyball", "Skiing", "Snowboarding",
            "Skating", "Martial Arts", "Boxing", "Climbing", "Golf", "Horse Riding"
        ],
        Travel: [
            "Adventure", "Beach", "Historical", "Cultural", "Nature", "Road Trip",
            "Cruise", "Backpacking", "Luxury", "Camping", "Solo Travel", "Family Travel",
            "Romantic Getaway", "Business Travel", "Group Travel", "Eco Travel", "Wildlife",
            "Urban Exploration", "Food and Drink", "Festival Travel"
        ],
        Clubbing: [
            "Nightclubs", "Bars", "Pubs", "Live Music", "Dance Clubs", "Themed Parties",
            "Karaoke", "Lounge Bars", "Rooftop Bars", "Beach Clubs", "Pool Parties",
            "Cocktail Bars", "Discos", "After Hours Clubs", "Jazz Clubs", "Comedy Clubs"
        ]
    };
    const categories = categoriesMap[category] || [];

    // Function to handle changes in the search input
    const handleSearch = (query) => {
        setSearchQuery(query);
    };

    // Function to handle category selection/deselection
    const handleSelectCategory = (category) => {
        if (selectedCategories.includes(category)) {
            setSelectedCategories(selectedCategories.filter(c => c !== category)); // Deselect category
        } else if (selectedCategories.length < 5) {
            setSelectedCategories([...selectedCategories, category]); // Select category if less than 3
        } else {
            Alert.alert('You can select up to 5 topics.'); // Alert if more than 3 selected
        }
    };

    // Function to handle the select button press
    const handleSelectButton = async () => {
        if (selectedCategories.length > 0) {
            const hasResults = await listUsersByConversationTopics(selectedCategories); // Fetch users by selected topics
            if (hasResults) {
                navigation.navigate('ConversationMatches'); // Navigate to matches if results found
            } else {
                Alert.alert('No matches found for the selected topics.'); // Alert if no matches found
            }
        } else {
            Alert.alert('Please select at least one topic.'); // Alert if no topics selected
        }
    };

    // Filter categories based on the search query
    const filteredCategories = categories.filter(category =>
        category.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <View style={styles.container}>
            <Text style={styles.headline}>What would you like to talk about?</Text>
            <Text style={styles.subtitle}>Choose up to 3 topics</Text>
            <TextInput
                style={styles.input}
                placeholder="Search category..."
                value={searchQuery}
                onChangeText={handleSearch} // Handle text input changes
            />
            <FlatList
                data={filteredCategories} // Display filtered categories
                renderItem={({ item }) => (
                    <TouchableOpacity onPress={() => handleSelectCategory(item)}>
                        <Text style={[styles.category, selectedCategories.includes(item) && styles.selectedCategory]}>{item}</Text>
                    </TouchableOpacity>
                )}
                keyExtractor={(item) => item} // Unique key for each category
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
        marginBottom: 10,
    },
    subtitle: {
        fontSize: 18,
        color: 'gray',
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
