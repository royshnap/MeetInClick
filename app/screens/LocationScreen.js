import React, { useState } from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import Slider from '@react-native-community/slider';

const Location = () => {
    const [distance, setDistance] = useState(10); // Initial distance is set to 10 meters

    const handleShowDistance = () => {
        alert(`Selected distance: ${distance} meters`);
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Choose the distance</Text>
            <Text style={styles.label}>Distance: {distance} meters</Text>
            <Slider
                style={styles.slider}
                minimumValue={10}
                maximumValue={1000}
                step={10}
                value={distance}
                onValueChange={(value) => setDistance(value)}
                thumbTintColor="#007AFF" // Light blue color for the thumb
                minimumTrackTintColor="#007AFF" // Light blue color for the track
            />
            <View style={styles.rangeLabels}>
                <Text style={styles.rangeLabel}>10m</Text>
                <Text style={styles.rangeLabel}>1KM</Text>
            </View>
            <Button title="Set" onPress={handleShowDistance} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    label: {
        fontSize: 18,
        marginBottom: 10,
    },
    slider: {
        width: '80%',
        height: 40,
        marginBottom: 20,
    },
    rangeLabels: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '80%',
    },
    rangeLabel: {
        fontSize: 16,
        color: 'gray',
    },
});

export default Location;
