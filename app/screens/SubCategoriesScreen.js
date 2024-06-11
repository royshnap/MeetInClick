import React, { useState } from 'react';
import { View, Text, TextInput, FlatList, ScrollView, StyleSheet, TouchableOpacity, Alert, ImageBackground } from 'react-native';
import { useConversationTopicMatches } from '../context/ConversationContext';
import { useTranslation } from 'react-i18next'; // Import useTranslation hook
import useSettings from '../components/useSettings';
import SettingsButton from '../components/SettingsButton';



const SubCategoriesScreen = ({ route, navigation }) => {
    const { t } = useTranslation();
    const { category } = route.params; // Get the main category from the route parameters
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategories, setSelectedCategories] = useState([]);
    const { backgroundImage, handleBackgroundChange, handleLanguageChange, handleSignOut } = useSettings(navigation);

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
            Alert.alert(t('You can select up to 5 topics.')); // Alert if more than 3 selected
        }
    };

    // Function to handle the select button press
    const handleSelectButton = async () => {
        if (selectedCategories.length > 0) {
            const hasResults = await listUsersByConversationTopics(selectedCategories); // Fetch users by selected topics
            if (hasResults) {
                navigation.navigate('ConversationMatches'); // Navigate to matches if results found
            } else {
                Alert.alert(t('No matches found for the selected topics.')); // Alert if no matches found
            }
        } else {
            Alert.alert(t('Please select at least one topic.')); // Alert if no topics selected
        }
    };

    // Filter categories based on the search query
    const filteredCategories = categories.filter(category =>
        category.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
      <ImageBackground source={backgroundImage} style={styles.background}>
        {/* <View style={styles.container}> */}
        <View style={styles.overlay}>
            <SettingsButton 
                onBackgroundChange={handleBackgroundChange}
                onLanguageChange={handleLanguageChange}
                onSignOut={handleSignOut}
            />
        <ScrollView style={styles.scrollView} contentContainerStyle={styles.contentContainer}>
            <Text style={styles.headline}>{t('What are your preferences?')}</Text>
            <Text style={styles.subtitle}>{t('Choose up to 5 topics')}</Text>
            <TextInput
                style={styles.input}
                placeholder={t('Search category...')}
                value={searchQuery}
                onChangeText={handleSearch} // Handle text input changes
            />
            <FlatList
                data={filteredCategories} // Display filtered categories
                renderItem={({ item }) => (
                    <TouchableOpacity onPress={() => handleSelectCategory(item)}>
                        <Text style={[styles.category, selectedCategories.includes(item) && styles.selectedCategory]}>{t(item)}</Text>
                    </TouchableOpacity>
                )}
                keyExtractor={(item) => item} // Unique key for each category
            />
            <TouchableOpacity style={styles.selectButton} onPress={handleSelectButton}>
                <Text style={styles.buttonText}>{t('Select')}</Text>
            </TouchableOpacity>
            </ScrollView>
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
      paddingTop: 80,
      paddingHorizontal: 10,
    },
    headline: {
      fontSize: 24,
      fontWeight: 'bold',
      color: '#000',
      textAlign: 'center',
      marginBottom: 10,
      marginTop: 40,
    },
    subtitle: {
      fontSize: 18,
      color: 'gray',
      textAlign: 'center',
      marginBottom: 20,
    },
    scrollView: {
        width: '100%',
    },
    contentContainer: {
        alignItems: 'center',
    },
    input: {
      width: '60%',
      height: 35,
      textAlign: 'center',
      borderWidth: 1,
      borderColor: 'gray',
      borderRadius: 20,
      marginBottom: 20,
      paddingHorizontal: 10,
      backgroundColor: 'white',
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
      justifyContent: 'center', // Center text vertically
      alignItems: 'center', // Center text horizontally
      width: '100%',
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
