// SettingsButton.js
import React, { useState } from 'react';
import { View, TouchableOpacity, StyleSheet, Image, Text } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import SettingsModal from '../SettingsModal'; // Adjust the path if necessary
import useSettings from '../components/useSettings'; // Adjust the path if necessary

const SettingsButton = ({ onBackgroundChange, onLanguageChange, onSignOut }) => {
  const [settingsVisible, setSettingsVisible] = useState(false);

  return (
    <>
      <TouchableOpacity style={styles.settingsButton} onPress={() => setSettingsVisible(true)}>
        <Icon name="settings-outline" size={34} color="#000" />
      </TouchableOpacity>
      <SettingsModal
        visible={settingsVisible}
        onClose={() => setSettingsVisible(false)}
        onBackgroundChange={onBackgroundChange}
        onLanguageChange={onLanguageChange}
        onSignOut={onSignOut}
      />
    </>
  );
};

const styles = StyleSheet.create({
  settingsButton: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
});

export default SettingsButton;
