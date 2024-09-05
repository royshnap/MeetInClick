import React from 'react';
import { View, Text, Image, Modal, Button, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';

const UserDetailsModal = ({ visible, user, onClose }) => {
  if (!user) return null;
  const { t } = useTranslation();

  const profileImage = user.profileImage
    ? { uri: user.profileImage }
    : user.gender === 'Female'
    ? require('../assets/defaultProfileImageWoman.png')
    : require('../assets/defaultProfileImageMan.png');

  return (
    <Modal
      animationType='slide'
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Image source={profileImage} style={styles.modalProfilePicture} />
          <Text style={styles.modalText}>
            Name: {user.firstName} {user.lastName}
          </Text>
          <Text style={styles.modalText}>Age: {user.age}</Text>
          <Text style={styles.modalText}>Gender: {user.gender}</Text>
          <Text style={styles.modalText}>
            Main Category: {user.mainCategory}
          </Text>
          <Text style={styles.modalText}>
            Topics: {user.conversationTopics.join(', ')}
          </Text>
          <Button title='Close' onPress={onClose} />
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
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalProfilePicture: {
    width: 150,
    height: 150,
    borderRadius: 75,
    marginBottom: 20,
  },
  modalText: {
    fontSize: 18,
    marginVertical: 5,
  },
});

export default UserDetailsModal;
