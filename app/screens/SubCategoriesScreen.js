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
        ].sort((a, b) => a.localeCompare(b)),
        "Sport Activity": [
            "Running", "Swimming", "Cycling", "Yoga", "Weightlifting", "Dancing",
            "Hiking", "Soccer", "Basketball", "Tennis", "Badminton", "Cricket",
            "Baseball", "Rugby", "Table Tennis", "Volleyball", "Skiing", "Snowboarding",
            "Skating", "Martial Arts", "Boxing", "Climbing", "Golf", "Horse Riding"
        ].sort((a, b) => a.localeCompare(b)),
        Travel: [
            "Adventure", "Beach", "Historical", "Cultural", "Nature", "Road Trip",
            "Cruise", "Backpacking", "Luxury", "Camping", "Solo Travel", "Family Travel",
            "Romantic Getaway", "Business Travel", "Group Travel", "Eco Travel", "Wildlife",
            "Urban Exploration", "Food and Drink", "Festival Travel"
        ].sort((a, b) => a.localeCompare(b)),
        Clubbing: [
            "Nightclubs", "Bars", "Pubs", "Live Music", "Dance Clubs", "Themed Parties",
            "Karaoke", "Lounge Bars", "Rooftop Bars", "Beach Clubs", "Pool Parties",
            "Cocktail Bars", "Discos", "After Hours Clubs", "Jazz Clubs", "Comedy Clubs"
        ].sort((a, b) => a.localeCompare(b))
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
            // if (hasResults) {
                navigation.navigate('ConversationMatches'); // Navigate to matches if results found
            // } else {
            //     Alert.alert('No matches found for the selected topics.'); // Alert if no matches found
            // }
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
            <Text style={styles.subtitle}>Choose up to 5 topics</Text>
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
        justifyContent: 'flex-start',
        alignItems: 'center',
        // backgroundColor: '#FFE12A',
        paddingTop: 20,
    },
    headline: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#333',
    },
    subtitle: {
        fontSize: 18,
        color: 'gray',
        marginBottom: 20,
    },
    input: {
        width: '80%',
        height: 35,
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 10,
        marginBottom: 20,
        paddingHorizontal: 10,
    },
    category: {
        backgroundColor: 'white',
        borderRadius: 15,
        marginBottom: 10,
        paddingVertical: 20,
        paddingHorizontal: 40,
        color: 'black',
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 2,
        elevation: 5,
    },
    selectedCategory: {
        backgroundColor: 'lightblue',
    },
    selectButton: {
        width: '80%',
        height: 50,
        backgroundColor: '#2EE411',
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
