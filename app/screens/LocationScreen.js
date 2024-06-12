import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Button, Alert, TouchableOpacity } from "react-native";
import Slider from "@react-native-community/slider";
import { useNavigation } from "@react-navigation/native";
import { useCurrentLocation } from "../context/LocationContext";

const Location = () => {
  const navigation = useNavigation();
  const { setInterestRadius, interestRadius } = useCurrentLocation();
  const [d, setDistance] = useState(interestRadius);

  useEffect(() => {
    setDistance(interestRadius);
  }, [interestRadius]);

  const handleShowDistance = () => {
    Alert.alert(`Selected distance: ${d} meters`, "", [
      { text: "Back", onPress: () => console.log("Back pressed"), style: "cancel" },
      {
        text: "OK",
        onPress: () => {
          setInterestRadius(d);
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
    <View style={styles.container}>
      <View style={styles.topContainer}>
        <Text style={styles.title}>Choose the distance</Text>
      </View>
      <View style={styles.middleContainer}>
        <Text style={styles.label}>Distance: {d} meters</Text>
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
              setInterestRadius(value);
            }}
            thumbTintColor="#007AFF" // Light blue color for the thumb
            minimumTrackTintColor="#007AFF" // Light blue color for the track
          />
          <TouchableOpacity onPress={incrementDistance} style={styles.adjustButton}>
            <Text style={styles.adjustButtonText}>+</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.rangeLabels}>
          <Text style={styles.rangeLabel}>10m</Text>
          <Text style={styles.rangeLabel}>1KM</Text>
        </View>
      </View>
      <View style={styles.bottomContainer}>
        <Button title="Set" onPress={handleShowDistance} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
  },
  topContainer: {
    width: "100%",
    alignItems: "center",
  },
  middleContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  bottomContainer: {
    width: "100%",
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 20,
  },
  label: {
    fontSize: 18,
    marginBottom: 10,
  },
  sliderContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "80%",
    marginBottom: 20,
  },
  slider: {
    flex: 1,
    height: 40,
  },
  adjustButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#007AFF",
    borderRadius: 20,
    marginHorizontal: 10,
  },
  adjustButtonText: {
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
  },
  rangeLabels: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "80%",
  },
  rangeLabel: {
    fontSize: 16,
    color: "gray",
  },
});

export default Location;