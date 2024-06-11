import React, { useState } from 'react';
import { View, Text, StyleSheet, Button, Alert } from 'react-native';
import Slider from '@react-native-community/slider';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next'; // Import useTranslation hook

const Location = () => {
    const { t } = useTranslation(); // Initialize translation hook
    const navigation = useNavigation();
    const [distance, setDistance] = useState(10); // Initial distance is set to 10 meters
    const handleShowDistance = () => {
        Alert.alert(
            t('Selected distance: {{distance}} meters', { distance }), // Translate the message with distance
            '',
            [
                { text: t('Back'), onPress: () => console.log('Back pressed'), style: 'cancel' },
                { text: t('Ok'), onPress: () => console.log('Ok pressed'), style: 'cancel' },
            ]
        );
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>{t('Choose the distance')}</Text>
            <Text style={styles.label}>{t('Distance')}: {distance} {t('meters')}</Text>
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
            <Button title={t('Set')} onPress={handleShowDistance} />
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
