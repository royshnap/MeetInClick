import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ImageBackground,
  FlatList,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import useSettings from '../components/useSettings';
import SettingsButton from '../components/SettingsButton';
import { getDatabase, ref, set } from 'firebase/database';
import { useAuth } from '../context/AuthContext';
import Firebase from '../config/firebase';

const PreferencesScreen = ({ navigation }) => {
  const { t } = useTranslation();
  const [selectedCategory, setSelectedCategory] = useState('');
  const [isNavigating, setIsNavigating] = useState(false);
  const { backgroundImage } = useSettings();
  const { user } = useAuth();

  const handleChooseCategory = (category) => {
    setSelectedCategory(category);
  };

  const getTitleForCategory = (category) => {
    const categoryTitles = {
      Conversation: t('Conversation'),
      'Sport Activity': t('Sport Activity'),
      Travel: t('Travel'),
      Clubbing: t('Clubbing'),
    };
    return categoryTitles[category] || t('Category');
  };

  useEffect(() => {
    if (isNavigating && selectedCategory) {
      const title = getTitleForCategory(selectedCategory);
      saveMainCategory(selectedCategory).then(() => {
        setIsNavigating(false);
        navigation.navigate('SubCategories', {
          category: selectedCategory,
          title,
        });
      });
    }
  }, [isNavigating, selectedCategory]);

  const handleChooseButton = () => {
    if (selectedCategory) {
      setIsNavigating(true);
    } else {
      Alert.alert(t('Please select a category'));
    }
  };

  const saveMainCategory = async (category) => {
    try {
      // Ensure the user is authenticated and has a valid UID
      const user = Firebase.Auth.currentUser;

      if (!user || !user.uid) {
        console.error('User is not authenticated or UID is undefined.');
        return; // Exit the function if the user is not properly authenticated
      }

      const db = getDatabase();
      const userRef = ref(db, `users/${user.uid}/mainCategory`);

      // Set the main category for the authenticated user
      await set(userRef, category);
      console.log('Main category saved successfully:', category);
    } catch (error) {
      console.error('Error saving main category to Firebase:', error);
    }
  };

  const categories = ['Conversation', 'Sport Activity', 'Travel', 'Clubbing'];

  return (
    <ImageBackground source={backgroundImage} style={styles.background}>
      <View style={styles.overlay}>
        <Text style={styles.title}>
          {t('What would you')}
          {'\n'}
          {t('like to do?')}
        </Text>
        <FlatList
          data={categories}
          keyExtractor={(item) => item}
          contentContainerStyle={styles.contentContainer}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.categoryButton,
                selectedCategory === item && styles.selectedCategory,
              ]}
              onPress={() => handleChooseCategory(item)}
              disabled={isNavigating} // Disable the button while navigating
            >
              <Text style={styles.categoryText}>{t(item)}</Text>
            </TouchableOpacity>
          )}
        />
        <TouchableOpacity
          style={styles.chooseButton}
          onPress={handleChooseButton}
          disabled={isNavigating} // Disable the button while navigating
        >
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
  contentContainer: {
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  categoryButton: {
    width: 200,
    height: 60,
    backgroundColor: 'white',
    borderRadius: 15,
    marginBottom: 10,
    justifyContent: 'center',
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
});

export default PreferencesScreen;
