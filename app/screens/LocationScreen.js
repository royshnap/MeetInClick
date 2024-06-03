import React, { useState } from 'react';
import { View, Text, StyleSheet, Button, Alert, TouchableOpacity } from 'react-native';
import Slider from '@react-native-community/slider';
import { useNavigation } from '@react-navigation/native';

const Location = () => {
    const navigation = useNavigation();
    const [distance, setDistance] = useState(10); // Initial distance is set to 10 meters

    const handleShowDistance = () => {
        Alert.alert(
            `Selected distance: ${distance} meters`,
            '',
            [
                { text: 'Back', onPress: () => console.log('Back pressed'), style: 'cancel', },
                { text: 'OK', onPress: () => navigation.navigate('ConversationMatches') }
            ]
        );
    };

    const incrementDistance = () => {
        setDistance(prevDistance => Math.min(prevDistance + 10, 1000));
    };

    const decrementDistance = () => {
        setDistance(prevDistance => Math.max(prevDistance - 10, 10));
    };

    return (
        <View style={styles.container}>
            <View style={styles.topContainer}>
                <Text style={styles.title}>Choose the distance</Text>
            </View>
            <View style={styles.middleContainer}>
                <Text style={styles.label}>Distance: {distance} meters</Text>
                <View style={styles.sliderContainer}>
                    <TouchableOpacity onPress={decrementDistance} style={styles.adjustButton}>
                        <Text style={styles.adjustButtonText}>-</Text>
                    </TouchableOpacity>
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
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
    },
    topContainer: {
        width: '100%',
        alignItems: 'center',
    },
    middleContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    bottomContainer: {
        width: '100%',
        marginBottom: 20,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginTop: 20,
    },
    label: {
        fontSize: 18,
        marginBottom: 10,
    },
    sliderContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '80%',
        marginBottom: 20,
    },
    slider: {
        flex: 1,
        height: 40,
    },
    adjustButton: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#007AFF',
        borderRadius: 20,
        marginHorizontal: 10,
    },
    adjustButtonText: {
        color: 'white',
        fontSize: 24,
        fontWeight: 'bold',
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
