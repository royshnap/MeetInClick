import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Alert, ImageBackground } from 'react-native';
import { useTranslation } from 'react-i18next';
import useSettings from '../components/useSettings';
import SettingsButton from '../components/SettingsButton';

const MainCategoriesScreen = ({ navigation }) => {
    const { t } = useTranslation();
    const [selectedCategory, setSelectedCategory] = useState('');
    const { backgroundImage, handleBackgroundChange, handleLanguageChange, handleSignOut } = useSettings(navigation);

    const handleChooseCategory = (category) => {
        setSelectedCategory(category);
    };

    const getTitleForCategory = (category) => {
        const categoryTitles = {
            'Conversation': t('Conversation'),
            'Sport Activity': t('Sport Activity'),
            'Travel': t('Travel'),
            'Clubbing': t('Clubbing')
        };
        return categoryTitles[category] || t('Category');
    };
    const handleChooseButton = () => {
        if (selectedCategory) {
            const title = getTitleForCategory(selectedCategory);
            navigation.navigate('SubCategories', { category: selectedCategory, title });
        } else {
            Alert.alert(t('Please select a category'));
        }
    };

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
                    {['Conversation', 'Sport Activity', 'Travel', 'Clubbing'].map((category) => (
                        <TouchableOpacity key={category} onPress={() => handleChooseCategory(category)}>
                            <Text style={[styles.category, selectedCategory === category && styles.selectedCategory]}>
                                {t(category)}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
                <TouchableOpacity style={styles.chooseButton} onPress={handleChooseButton}>
                    <Text style={styles.chooseButtonText}>{t('Select')}</Text>
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
        paddingTop: 140,
        paddingHorizontal: 10,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 30,
        color: '#FFF',
        textAlign: 'center',
    },
    scrollView: {
        width: '100%',
    },
    contentContainer: {
        alignItems: 'center',
        paddingHorizontal: 20,
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

export default MainCategoriesScreen;