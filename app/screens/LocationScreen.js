import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Alert, TouchableOpacity, ImageBackground } from "react-native";
import Slider from "@react-native-community/slider";
import { useNavigation } from "@react-navigation/native";
import { useCurrentLocation } from "../context/LocationContext";
import { useTranslation } from "react-i18next";
import useSettings from "../components/useSettings";
import SettingsButton from "../components/SettingsButton";
import ProfileHeader from '../components/ProfileHeader';

const Location = () => {
  const navigation = useNavigation();
  const { t } = useTranslation();
  const { setInterestRadius, interestRadius } = useCurrentLocation();
  const [d, setDistance] = useState(interestRadius);
  const { backgroundImage, handleBackgroundChange, handleLanguageChange, handleSignOut } = useSettings(navigation);

  useEffect(() => {
    setDistance(interestRadius);
  }, [interestRadius]);

  const handleShowDistance = () => {
    Alert.alert(`${t('Selected distance')}: ${d} ${t('meters')}`, "", [
      { text: t('Back'), onPress: () => console.log("Back pressed"), style: "cancel" },
      {
        text: t('OK'),
        onPress: () => {
          setInterestRadius(d); // Update interest radius here
          navigation.navigate('ConversationMatches');
        },
      },
    ]);
  };

  const incrementDistance = () => {
    setDistance((prevDistance) => {
      const newDistance = Math.min(prevDistance + 10, 1000);
      setInterestRadius(newDistance);
      return newDistance;
    });
  };

  const decrementDistance = () => {
    setDistance((prevDistance) => {
      const newDistance = Math.max(prevDistance - 10, 10);
      setInterestRadius(newDistance);
      return newDistance;
    });
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
        <Text style={styles.title}>{t('Choose the distance')}</Text>
        <Text style={styles.label}>{t('Distance')}: {d} {t('meters')}</Text>
        <View style={styles.sliderContainer}>
          <TouchableOpacity onPress={decrementDistance} style={styles.adjustButton}>
            <Text style={styles.adjustButtonText}>-</Text>
          </TouchableOpacity>
          <Slider
            style={styles.slider}
            minimumValue={10}
            maximumValue={1000}
            step={10}
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
          <Text style={styles.rangeLabel}>10m</Text>
          <Text style={styles.rangeLabel}>1KM</Text>
        </View>
        <TouchableOpacity style={styles.setButton} onPress={handleShowDistance}>
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
    marginBottom: 50,
    marginTop: 30,
  },
  label: {
    fontSize: 20,
    color: 'white',
    marginBottom: 30,
  },
  sliderContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "80%",
    marginBottom: 15,
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
    marginBottom: 25,
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
    marginTop: 20,
  },
  setButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default Location;
