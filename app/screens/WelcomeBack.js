import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
  Image,
} from 'react-native';
import useSettings from '../components/useSettings';

const WelcomeBack = ({ route, navigation }) => {
  const { username, mainCategory, conversationTopics } = route.params;
  const { backgroundImage } = useSettings();

  return (
    <ImageBackground source={backgroundImage} style={styles.background}>
      <View style={styles.overlay}>
        <Image
          source={require('../assets/LOGO7removebg.png')}
          style={styles.logo}
          resizeMode="contain"
        />

        <Text style={styles.welcomeText}>Welcome Back, {username}!</Text>

        <Text style={styles.mainCategoryText}>Your main category is:</Text>
        <Text style={styles.highlight}>{mainCategory}</Text>

        <Text style={styles.subCategoryText}>Your subcategories are:</Text>
        <Text style={styles.highlight}>{conversationTopics}</Text>

        <TouchableOpacity
          style={styles.smallButton}
          onPress={() => navigation.navigate( 'AppTabs', { screen:'Preferences' })}
        >
          <Text style={styles.smallButtonText}>Change Main Category</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.smallButton}
          onPress={() => navigation.navigate( 'AppTabs', { screen:'Filter' })}
        >
          <Text style={styles.smallButtonText}>Change Filters</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.largeButton}
          onPress={() => navigation.navigate('AppTabs', { screen: 'Matches'})}
        >
          <Text style={styles.largeButtonText}>Go to Matches</Text>
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
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: 80,
    paddingHorizontal: 10,
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 20,
  },
  welcomeText: {
    fontSize: 30,
    fontWeight: 'bold',
    color: 'black',
    marginBottom: 40,
    textAlign: 'center',
  },
  mainCategoryText: {
    fontSize: 22,
    color: 'black',
    marginBottom: 10,
    textAlign: 'center',
  },
  subCategoryText: {
    fontSize: 22,
    color: 'black',
    marginBottom: 10,
    textAlign: 'center',
  },
  highlight: {
    fontSize: 24,
    color: 'blue', // Blue color for highlighting
    fontWeight: 'bold',
    marginBottom: 30,
  },
  smallButton: {
    backgroundColor: '#007AFF', // Blue button background
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 8,
    marginVertical: 8,
    width: '70%', // Button width
    alignItems: 'center',
  },
  smallButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  largeButton: {
    backgroundColor: '#FF5733', // Highlighted button background
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 8,
    marginVertical: 20,
    width: '80%', // Button width
    alignItems: 'center',
  },
  largeButtonText: {
    color: '#fff',
    fontSize: 26,
    fontWeight: 'bold',
  },
});

export default WelcomeBack;
