import React, { useState } from 'react';
import { View, Text, TextInput, FlatList, StyleSheet, TouchableOpacity, Alert, ImageBackground } from 'react-native';
import { useConversationTopicMatches } from '../context/ConversationContext';
import { useTranslation } from 'react-i18next';
import useSettings from '../components/useSettings';
import SettingsButton from '../components/SettingsButton';

const MAX_SUBCATEGORIES = 5;

const SubCategoriesScreen = ({ route, navigation }) => {
    const { t } = useTranslation();
    const { category } = route.params;
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategories, setSelectedCategories] = useState([]);
    const { backgroundImage, handleBackgroundChange, handleLanguageChange, handleSignOut } = useSettings();
  
    const {
      listUsersByConversationTopics, loading, error, conversationTopicResults
    } = useConversationTopicMatches();

    const categoriesMap = {
        Conversation: [
            "AAATest", "Travel", "Books", "Music", "Movies", "Hobbies", "Food", "Technology", "Career",
            "Childhood", "Health", "Relationships", "Culture", "Fashion", "Goals", "Politics",
            "Psychology", "News", "Sports", "Business", "Art", "Philosophy", "Nature", "Social",
            "Education", "Funny", "Achievements", "Anime", "Netflix", "Languages", "Pets", "Science", "Dreams",
            "Traditions", "Concerts", "Inspiration", "Finance", "Vacations", "Quotes",
            "Fitness", "Adventure", "Creativity"
        ].sort((a, b) => a.localeCompare(b)),
        "Sport Activity": [
            "AAATest", "Running", "Swimming", "Cycling", "Yoga", "Weightlifting", "Dancing",
            "Hiking", "Soccer", "Basketball", "Tennis", "Badminton", "Cricket",
            "Baseball", "Rugby", "Table Tennis", "Volleyball", "Skiing", "Snowboarding",
            "Skating", "Martial Arts", "Boxing", "Climbing", "Golf", "Horse Riding"
        ].sort((a, b) => a.localeCompare(b)),
        Travel: [
            "AAATest", "Adventure", "Beach", "Historical", "Cultural", "Nature", "Road Trip",
            "Cruise", "Backpacking", "Luxury", "Camping", "Solo Travel", "Family Travel",
            "Romantic Getaway", "Business Travel", "Group Travel", "Eco Travel", "Wildlife",
            "Urban Exploration", "Food and Drink", "Festival Travel"
        ].sort((a, b) => a.localeCompare(b)),
        Clubbing: [
            "AAATest", "Nightclubs", "Bars", "Pubs", "Live Music", "Dance Clubs", "Themed Parties",
            "Karaoke", "Lounge Bars", "Rooftop Bars", "Beach Clubs", "Pool Parties",
            "Cocktail Bars", "Discos", "After Hours Clubs", "Jazz Clubs", "Comedy Clubs"
        ].sort((a, b) => a.localeCompare(b))
    };
    const categories = categoriesMap[category] || [];

    const getTitleForCategory = (category) => {
        const categoryTitles = {
            'Conversation': t('What would you like to talk about?'),
            'Sport Activity': t('What kind of sport would you like to do?'),
            'Travel': t('Which kind of travel you want?'),
            'Clubbing': t('What type of club you want to go?')
        };
        return categoryTitles[category] || t('What are your preferences?');
    };

    const handleSearch = (query) => {
        setSearchQuery(query);
    };

    const handleSelectCategory = (category) => {
        if (selectedCategories.includes(category)) {
            setSelectedCategories(selectedCategories.filter(c => c !== category));
        } else if (selectedCategories.length < MAX_SUBCATEGORIES) {
            setSelectedCategories([...selectedCategories, category]);
        } else {
            Alert.alert(t('You can select up to 5 topics.'));
        }
    };

    const handleSelectButton = async () => {
        if (selectedCategories.length > 0) {
            await listUsersByConversationTopics(selectedCategories);
            navigation.navigate('Location');
        } else {
            Alert.alert(t('Please select at least one topic.'));
        }
    };

    const filteredCategories = categories.filter(category =>
        category.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <ImageBackground source={backgroundImage} style={styles.background}>
            <View style={styles.overlay}>
                <SettingsButton 
                    onBackgroundChange={handleBackgroundChange}
                    onLanguageChange={handleLanguageChange}
                    onSignOut={() => handleSignOut(navigation)}
                />
                <Text style={[styles.headline, { color: 'white' }]}>{getTitleForCategory(category)}</Text>
                <Text style={styles.subtitle}>{t('Choose up to 5 topics')}</Text>
                <TextInput
                    style={styles.input}
                    placeholder={t('Search category...')}
                    value={searchQuery}
                    onChangeText={handleSearch}
                />
                <FlatList
                    data={filteredCategories}
                    renderItem={({ item }) => (
                        <TouchableOpacity onPress={() => handleSelectCategory(item)}>
                            <Text style={[styles.category, selectedCategories.includes(item) && styles.selectedCategory]}>{t(item)}</Text>
                        </TouchableOpacity>
                    )}
                    keyExtractor={(item) => item}
                    contentContainerStyle={{ paddingBottom: 100 }}
                />
                <TouchableOpacity style={styles.selectButton} onPress={handleSelectButton}>
                    <Text style={styles.buttonText}>{t('Select')}</Text>
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
        paddingTop: 80,
        paddingHorizontal: 10,
    },
    headline: {
        fontSize: 27,
        fontWeight: 'bold',
        color: 'white',
        textAlign: 'center',
        marginBottom: 10,
        marginTop: 20,
    },
    subtitle: {
        fontSize: 18,
        color: 'gray',
        textAlign: 'center',
        marginBottom: 20,
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
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
    },
    selectedCategory: {
        backgroundColor: 'lightblue',
    },
    selectButton: {
        position: 'absolute',
        bottom: 20,
        width: '30%',
        height: 50,
        backgroundColor: '#2EE411',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
    },
    buttonText: {
        color: 'white',
        fontSize: 23,
        fontWeight: 'bold',
    },
});

export default SubCategoriesScreen;
