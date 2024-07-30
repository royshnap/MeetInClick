import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Alert, TouchableOpacity, ImageBackground, Modal } from "react-native";
import Slider from "@react-native-community/slider";
import { useNavigation } from "@react-navigation/native";
import { useCurrentLocation } from "../context/LocationContext";
import { useTranslation } from "react-i18next";
import useSettings from "../components/useSettings";
import SettingsButton from "../components/SettingsButton";
import ProfileHeader from '../components/ProfileHeader';

const Filter = () => {
  const navigation = useNavigation();
  const { t } = useTranslation();
  const { setInterestRadius, interestRadius } = useCurrentLocation();
  const [d, setDistance] = useState(interestRadius);
  const [ageRange, setAgeRange] = useState([18, 99]);
  const [genderPreference, setGenderPreference] = useState('Both');
  const [isAgeRangeVisible, setIsAgeRangeVisible] = useState(false);
  const { backgroundImage, handleBackgroundChange, handleLanguageChange, handleSignOut } = useSettings(navigation);

  useEffect(() => {
    setDistance(interestRadius);
  }, [interestRadius]);

  const handleSetFilters = () => {
    Alert.alert(`${t('Filters set')}`, "", [
      { text: t('OK'), onPress: () => navigation.navigate('ConversationMatches') },
    ]);
  };

  const incrementDistance = () => {
    setDistance((prevDistance) => {
      const newDistance = Math.min(prevDistance + 20, 100000);
      setInterestRadius(newDistance);
      return newDistance;
    });
  };

  const decrementDistance = () => {
    setDistance((prevDistance) => {
      const newDistance = Math.max(prevDistance - 20, 100);
      setInterestRadius(newDistance);
      return newDistance;
    });
  };

  const incrementAge = (index) => {
    setAgeRange((prevAgeRange) => {
      const newAgeRange = [...prevAgeRange];
      newAgeRange[index] = Math.min(newAgeRange[index] + 3, index === 0 ? newAgeRange[1] - 3 : 99);
      return newAgeRange;
    });
  };

  const decrementAge = (index) => {
    setAgeRange((prevAgeRange) => {
      const newAgeRange = [...prevAgeRange];
      newAgeRange[index] = Math.max(newAgeRange[index] - 3, index === 1 ? newAgeRange[0] + 3 : 18);
      return newAgeRange;
    });
  };

  const handleAgeRangePress = () => {
    setIsAgeRangeVisible(true);
  };

  const handleAgeRangeClose = () => {
    setIsAgeRangeVisible(false);
  };
  const formatDistance = (distance) => {
    if (distance >= 1000) {
      return `${(distance / 1000).toFixed(1)} KM`;
    }
    return `${distance} meters`;
  };

  return (
    <ImageBackground source={backgroundImage} style={styles.background}>
      <ProfileHeader navigation={navigation} />
      <View style={styles.overlay}>
        <SettingsButton
          onBackgroundChange={handleBackgroundChange}
          onLanguageChange={handleLanguageChange}
          onSignOut={() => handleSignOut(navigation)}
        />
        <Text style={styles.title}>{t('SELECT FILTERS')}</Text>
        <View style={styles.filterContainer}>
        <Text style={styles.label}>{t('Distance Preference:')}</Text>
          <Text style={styles.label}>{t('Distance')}: {formatDistance(d)}</Text>
          <View style={styles.sliderContainer}>
            <TouchableOpacity onPress={decrementDistance} style={styles.adjustButton}>
              <Text style={styles.adjustButtonText}>-</Text>
            </TouchableOpacity>
            <Slider
              style={styles.slider}
              minimumValue={0}
              maximumValue={10000}
              step={20}
              value={d}
              onValueChange={(value) => {
                setDistance(value);
                setInterestRadius(value); // Update interest radius here
              }}
              thumbTintColor="#007AFF"
              minimumTrackTintColor="#007AFF"
            />
            <TouchableOpacity onPress={incrementDistance} style={styles.adjustButton}>
              <Text style={styles.adjustButtonText}>+</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.rangeLabels}>
            <Text style={styles.rangeLabel}>0m</Text>
            <Text style={styles.rangeLabel}>10KM</Text>
          </View>
        </View>

        <View style={styles.filterContainer}>
        <Text style={styles.label}>{t('Age Range Preference:')}</Text>
          <TouchableOpacity style={styles.setButton} onPress={handleAgeRangePress}>
            <Text style={styles.setButtonText}>{t('Age Range')}</Text>
          </TouchableOpacity>
          <Modal
            visible={isAgeRangeVisible}
            animationType="slide"
            transparent={true}
            onRequestClose={handleAgeRangeClose}
          >
            <View style={styles.modalOverlay}>
              <View style={styles.ageRangeContainer}>
                <Text style={styles.ageRangeTitle}>{t('Select Age Range')}</Text>
                <View style={styles.ageRangeContent}>
                  <View style={styles.ageColumn}>
                    <Text style={styles.ageLabel}>{t('Min Age')}</Text>
                    <TouchableOpacity onPress={() => decrementAge(0)} style={styles.adjustButton}>
                      <Text style={styles.adjustButtonText}>-</Text>
                    </TouchableOpacity>
                    <Text style={styles.ageValue}>{ageRange[0]}</Text>
                    <TouchableOpacity onPress={() => incrementAge(0)} style={styles.adjustButton}>
                      <Text style={styles.adjustButtonText}>+</Text>
                    </TouchableOpacity>
                  </View>
                  <View style={styles.ageColumn}>
                    <Text style={styles.ageLabel}>{t('Max Age')}</Text>
                    <TouchableOpacity onPress={() => decrementAge(1)} style={styles.adjustButton}>
                      <Text style={styles.adjustButtonText}>-</Text>
                    </TouchableOpacity>
                    <Text style={styles.ageValue}>{ageRange[1]}</Text>
                    <TouchableOpacity onPress={() => incrementAge(1)} style={styles.adjustButton}>
                      <Text style={styles.adjustButtonText}>+</Text>
                    </TouchableOpacity>
                  </View>
                </View>
                <TouchableOpacity style={styles.closeButton} onPress={handleAgeRangeClose}>
                  <Text style={styles.setButtonText}>{t('Close')}</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        </View>

        
        <View style={styles.filterContainer}>
          <Text style={styles.label}>{t('Gender Preference:')}</Text>
          <View style={styles.genderContainer}>
            <TouchableOpacity
              style={[styles.genderButton, genderPreference === 'Man' && styles.selectedGenderButton]}
              onPress={() => setGenderPreference('Man')}
            >
              <Text style={styles.genderButtonText}>{t('Man')}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.genderButton, genderPreference === 'Woman' && styles.selectedGenderButton]}
              onPress={() => setGenderPreference('Woman')}
            >
              <Text style={styles.genderButtonText}>{t('Woman')}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.genderButton, genderPreference === 'Both' && styles.selectedGenderButton]}
              onPress={() => setGenderPreference('Both')}
            >
              <Text style={styles.genderButtonText}>{t('Both')}</Text>
            </TouchableOpacity>
          </View>
        </View>
        <TouchableOpacity style={styles.setButton} onPress={handleSetFilters}>
          <Text style={styles.setButtonText}>{t('Set')}</Text>
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
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: 'white',
    marginBottom: 25,
    marginTop: 10,
  },
  filterContainer: {
    width: '100%',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 3,
    borderBottomColor: 'black',
    borderBottomStyle: 'solid',
    marginBottom: 10,
  },
  label: {
    fontSize: 20,
    color: 'white',
    marginBottom: 10,
  },
  sliderContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "80%",
  },
  slider: {
    flex: 1,
    height: 40,
  },
  adjustButton: {
    width: 35,
    height: 35,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#007AFF",
    borderRadius: 20,
    marginHorizontal: 10,
  },
  adjustButtonText: {
    color: "white",
    fontSize: 30,
    fontWeight: "bold",
  },
  rangeLabels: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "80%",
    marginBottom: 15,
  },
  rangeLabel: {
    fontSize: 17,
    color: "white",
  },
  setButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 10,
    paddingHorizontal: 40,
    borderRadius: 10,
    marginTop: 5,
  },
  setButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  ageRangeContainer: {
    width: '70%',
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  bottomBorder: {
    height: 2,
    width: '100%',
    backgroundColor: 'black',
    marginVertical: 10,
  },
  ageRangeTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  ageRangeContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 20,
  },
  ageColumn: {
    alignItems: 'center',
    width: '40%',
  },
  ageLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  ageValue: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  closeButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 10,
    paddingHorizontal: 40,
    borderRadius: 10,
  },
  genderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '80%',
    marginBottom: 5,
  },
  genderButton: {
    paddingVertical: 6,
    paddingHorizontal: 15,
    borderRadius: 10,
    backgroundColor: 'gray',
  },
  selectedGenderButton: {
    backgroundColor: '#007AFF',
  },
  genderButtonText: {
    color: 'white',
    fontSize: 18,
  },
});

export default Filter;
