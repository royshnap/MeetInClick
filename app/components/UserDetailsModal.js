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
              {t('Name')}: {user.firstName} {user.lastName}
            </Text>
            <Text style={styles.modalText}>{t('Age')}: {user.age}</Text>
            <Text style={styles.modalText}>{t('Gender')}: {t(user.gender)}</Text>
            <Text style={styles.modalText}>
              {t('Main Category')}: {t(user.mainCategory)}

            </Text>
            <Text style={styles.modalText}>
              {t('Topics')}: {user.conversationTopics.map(topic => t(`${topic}`)).join(', ')}
            </Text>
            <Button title={t('Close')} onPress={onClose} />
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
    width: 200,
    height: 200,
    borderRadius: 90,
    marginBottom: 20,
  },
  modalText: {
    fontSize: 18,
    marginVertical: 5,
    alignSelf: 'center',
  },
});

export default UserDetailsModal;
