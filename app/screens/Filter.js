import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  TouchableOpacity,
  ImageBackground,
} from 'react-native';
import Slider from '@react-native-community/slider';
import MultiSlider from '@ptomasroos/react-native-multi-slider';
import { useNavigation } from '@react-navigation/native';
import { useCurrentLocation } from '../context/LocationContext';
import { useTranslation } from 'react-i18next';
import useSettings from '../components/useSettings';

const MAX_DISTANCE = 10000; // 10 km
const DISTANCE_INTERVAL = 20; // 20 meters
const AGE_INTERVAL = 3; // 3 years
const MIN_AGE = 18; // Minimum age
const MAX_AGE = 120; // Maximum age

const Filter = () => {
  const navigation = useNavigation();
  const { t } = useTranslation();
  const { setInterestRadius, interestRadius } = useCurrentLocation();
  const [d, setDistance] = useState(interestRadius);
  const [ageRange, setAgeRange] = useState([MIN_AGE, MAX_AGE]);
  const [genderPreference, setGenderPreference] = useState('Both');
  const { backgroundImage } = useSettings(navigation);

  useEffect(() => {
    setDistance(interestRadius);
  }, [interestRadius]);

  const handleSetFilters = () => {
    navigation.navigate('AppTabs', {
      screen: 'Matches',
      params: {
        ageRange,
        genderPreference,
      },
    });
  };

  const incrementDistance = () => {
    setDistance((prevDistance) => {
      const newDistance = Math.min(
        prevDistance + DISTANCE_INTERVAL,
        MAX_DISTANCE
      );
      setInterestRadius(newDistance);
      return newDistance;
    });
  };

  const decrementDistance = () => {
    setDistance((prevDistance) => {
      const newDistance = Math.max(prevDistance - DISTANCE_INTERVAL, 0);
      setInterestRadius(newDistance);
      return newDistance;
    });
  };

  const incrementAge = (index) => {
    setAgeRange((prevAgeRange) => {
      const newAgeRange = [...prevAgeRange];
      newAgeRange[index] = Math.min(
        newAgeRange[index] + AGE_INTERVAL,
        index === 0 ? newAgeRange[1] : MAX_AGE
      );
      return newAgeRange;
    });
  };

  const decrementAge = (index) => {
    setAgeRange((prevAgeRange) => {
      const newAgeRange = [...prevAgeRange];
      newAgeRange[index] = Math.max(
        newAgeRange[index] - AGE_INTERVAL,
        index === 1 ? newAgeRange[0] : MIN_AGE
      );
      return newAgeRange;
    });
  };

  const formatDistance = (distance) => {
    if (distance >= 1000) {
      return `${(distance / 1000).toFixed(2)} KM`;
    }
    return `${distance.toFixed(2)} meters`;
  };

  return (
    <ImageBackground source={backgroundImage} style={styles.background}>
      <View style={styles.overlay}>
        <Text style={styles.title}>{t('SELECT FILTERS')}</Text>

        <View style={styles.filterContainer}>
          <Text style={styles.label}>
            {t('Distance')}: {formatDistance(d)}
          </Text>
          <View style={styles.sliderContainer}>
            <TouchableOpacity
              onPress={decrementDistance}
              style={styles.adjustButton}
            >
              <Text style={styles.adjustButtonText}>-</Text>
            </TouchableOpacity>
            <Slider
              style={styles.slider}
              minimumValue={0}
              maximumValue={MAX_DISTANCE}
              step={DISTANCE_INTERVAL}
              value={d}
              onValueChange={(value) => {
                setDistance(value);
                setInterestRadius(value); // Update interest radius here
              }}
              thumbTintColor='#007AFF'
              minimumTrackTintColor='#007AFF'
            />
            <TouchableOpacity
              onPress={incrementDistance}
              style={styles.adjustButton}
            >
              <Text style={styles.adjustButtonText}>+</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.rangeLabels}>
            <Text style={styles.rangeLabel}>0m</Text>
            <Text style={styles.rangeLabel}>10KM</Text>
          </View>
        </View>

        <View style={styles.filterContainer}>
          <Text style={styles.label}>
            {t('Age Range')}: {ageRange[0]} - {ageRange[1]}
          </Text>
          <View style={styles.sliderContainer}>
            <TouchableOpacity
              onPress={() => decrementAge(0)}
              style={styles.adjustButton}
            >
              <Text style={styles.adjustButtonText}>-</Text>
            </TouchableOpacity>
            <MultiSlider
              values={ageRange}
              sliderLength={200}
              onValuesChange={(values) => setAgeRange(values)}
              min={MIN_AGE}
              max={MAX_AGE}
              step={AGE_INTERVAL}
              allowOverlap={false}
              snapped
              selectedStyle={{
                backgroundColor: '#007AFF',
              }}
              unselectedStyle={{
                backgroundColor: 'silver',
              }}
              markerStyle={{
                backgroundColor: '#007AFF',
              }}
            />
            <TouchableOpacity
              onPress={() => incrementAge(1)}
              style={styles.adjustButton}
            >
              <Text style={styles.adjustButtonText}>+</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.ageRangeLabels}>
            <Text style={styles.ageRangeLabel}>{ageRange[0]}</Text>
            <Text style={styles.ageRangeLabel}>{ageRange[1]}</Text>
          </View>
        </View>

        <View style={styles.filterContainer}>
          <Text style={styles.label}>{t('Gender Preference')}</Text>
          <View style={styles.genderContainer}>
            <TouchableOpacity
              style={[
                styles.genderButton,
                genderPreference === 'Male' && styles.selectedGenderButton,
              ]}
              onPress={() => setGenderPreference('Male')}
            >
              <Text style={styles.genderButtonText}>{t('Male')}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.genderButton,
                genderPreference === 'Female' && styles.selectedGenderButton,
              ]}
              onPress={() => setGenderPreference('Female')}
            >
              <Text style={styles.genderButtonText}>{t('Female')}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.genderButton,
                genderPreference === 'Both' && styles.selectedGenderButton,
              ]}
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
    fontWeight: 'bold',
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
    flexDirection: 'row',
    alignItems: 'center',
    width: '80%',
  },
  slider: {
    flex: 1,
    height: 40,
  },
  adjustButton: {
    width: 35,
    height: 35,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#007AFF',
    borderRadius: 20,
    marginHorizontal: 10,
  },
  adjustButtonText: {
    color: 'white',
    fontSize: 30,
    fontWeight: 'bold',
  },
  rangeLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
    marginBottom: 15,
  },
  rangeLabel: {
    fontSize: 17,
    color: 'white',
  },
  ageRangeLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
    marginTop: 10,
  },
  ageRangeLabel: {
    fontSize: 18,
    color: 'white',
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
