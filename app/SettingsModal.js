import React, { useState } from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet, ScrollView, Image } from 'react-native';
import { useTranslation } from 'react-i18next';

const SettingsModal = ({ visible, onClose, onBackgroundChange, onLanguageChange, onSignOut, navigation }) => {
  const { t } = useTranslation();
  const [showBackgroundOptions, setShowBackgroundOptions] = useState(false); // State to control visibility
  const backgrounds = [
    require('./assets/b1.png'),
    require('./assets/b2.jpg'),
    require('./assets/b3.jpg'),
    require('./assets/b4.jpg'),
    require('./assets/b5.jpg'),
    require('./assets/b6.jpg'),
    require('./assets/b7.jpg'),
    require('./assets/b8.jpg'),
    require('./assets/b9.jpg'),
    require('./assets/b10.jpg'),
    require('./assets/b11.jpg'),
    require('./assets/b12.jpg'),
    require('./assets/b13.jpg'),
    require('./assets/b14.jpg'),

  ];

  const handleBackgroundButtonPress = () => {
    setShowBackgroundOptions(!showBackgroundOptions); // Toggle visibility
  };

  const handleSignOutPress = () => {
    onClose();
    onSignOut(navigation)

  };

  return (
    <Modal transparent={true} visible={visible} animationType="slide">
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>{t('Settings')}</Text>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>X</Text>
          </TouchableOpacity>
          <View style={styles.separator} />
          <View style={styles.section}>
            <TouchableOpacity style={styles.changeBackgroundButton} onPress={handleBackgroundButtonPress}>
              <Text style={styles.changeBackgroundButtonText}>{t('Change Background')}</Text>
            </TouchableOpacity>
            {showBackgroundOptions && (
              <ScrollView contentContainerStyle={styles.backgroundOptions} horizontal>
                {backgrounds.map((background, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.backgroundOption}
                    onPress={() => onBackgroundChange(background)}
                  >
                    <Image source={background} style={styles.backgroundImage} />
                    <Text style={styles.backgroundOptionText}>{`${t('Background')} ${index + 1}`}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            )}
          </View>

          <View style={styles.separator} />

          <View style={styles.section}>
            <TouchableOpacity style={styles.languageButton} onPress={onLanguageChange}>
              <Text style={styles.languageButtonText}>{t('Change Language')}</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.separator} />

          <View style={styles.section}>
            <TouchableOpacity style={styles.signOutButton} onPress={handleSignOutPress}>
              <Text style={styles.signOutButtonText}>{t('Sign Out')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '65%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 30,
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  closeButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'red',
  },
  section: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 20,
  },
  optionTitle: {
    fontSize: 18,
    marginBottom: 10,
  },
  backgroundOptions: {
    marginTop: 10,
    alignItems: 'center',
  },
  backgroundOption: {
    alignItems: 'center',
    marginRight: 10,
  },
  backgroundImage: {
    width: 100,
    height: 100,
    borderRadius: 10,
  },
  backgroundOptionText: {
    fontSize: 16,
    textAlign: 'center',
  },
  changeBackgroundButton: {
    backgroundColor: '#053CE6',
    borderRadius: 10,
    padding: 10,
  },
  changeBackgroundButtonText: {
    fontSize: 16,
    color: 'white',
  },
  languageButton: {
    backgroundColor: '#053CE6',
    borderRadius: 10,
    padding: 10,
  },
  languageButtonText: {
    fontSize: 16,
    color: 'white',
  },
  signOutButton: {
    backgroundColor: 'red',
    borderRadius: 10,
    padding: 10,
  },
  signOutButtonText: {
    fontSize: 16,
    color: 'white',
  },
  separator: {
    height: 5,
    width: '100%',
    backgroundColor: '#E0E0E0',
    marginVertical: 10,
  },
});

export default SettingsModal;
