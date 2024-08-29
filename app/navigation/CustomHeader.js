import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Dimensions, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import useSettings from '../components/useSettings';
import SettingsButton from '../components/SettingsButton';
import Firebase from '../config/firebase';
import { ref, onValue, update } from 'firebase/database';
import { useAuth } from '../context/AuthContext';

const { width } = Dimensions.get('window');

const CustomHeader = ({ navigation }) => {
  const { user } = useAuth();
  const [hasNewNotification, setHasNewNotification] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [showNotificationModal, setShowNotificationModal] = useState(false);
  const {
    handleBackgroundChange,
    handleLanguageChange,
    handleSignOut,
  } = useSettings();
  
  const userId = user?.id;

  useEffect(() => {
    if (userId) {
      const notificationsRef = ref(Firebase.Database, `notification/${userId}`);
      const unsubscribe = onValue(notificationsRef, (snapshot) => {
        if (snapshot.exists()) {
          const notificationsData = snapshot.val();
          const allNotifications = [];

          if (notificationsData.newMatches) {
            Object.values(notificationsData.newMatches).forEach((match) => {
              allNotifications.push({
                type: 'newMatches',
                content: `You have a new match with ${match.userName}`,
                timestamp: match.timestamp,
              });
            });
          }

          if (notificationsData.newMessages) {
            Object.values(notificationsData.newMessages).forEach((message) => {
              allNotifications.push({
                type: 'newMessages',
                content: `You have a new message from ${message.userName}`,
                timestamp: message.timestamp,
              });
            });
          }

          allNotifications.sort((a, b) => b.timestamp - a.timestamp);

          setNotifications(allNotifications);
          setHasNewNotification(allNotifications.length > 0);
        } else {
          setHasNewNotification(false);
          setNotifications([]);
        }
      });

      return () => unsubscribe();
    }
  }, [userId]);

  const handleNotificationPress = () => {
    setShowNotificationModal(true);
  };

  const handleCloseModal = () => {
    setShowNotificationModal(false);

    // Optionally mark notifications as read when modal is closed
    if (userId) {
      const notificationsRef = ref(Firebase.Database, `notification/${userId}`);
      update(notificationsRef, {
        newMatches: null,
        newMessages: null,
      });
      setHasNewNotification(false);
    }
  };

  return (
    <View style={styles.headerContainer}>
      <Text style={styles.headerTitle}>Meet In Click</Text>
      <View style={styles.iconsContainer}>
        <TouchableOpacity onPress={handleNotificationPress} style={styles.notificationIconContainer}>
          <Ionicons
            name={hasNewNotification ? 'notifications' : 'notifications-outline'}
            size={24}
            color={hasNewNotification ? 'orange' : 'black'}
            style={styles.icon}
          />
          {hasNewNotification && (
            <View style={styles.notificationBadge}>
              <Text style={styles.notificationBadgeText}>{notifications.length}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {/* Modal for notifications */}
      <Modal
        visible={showNotificationModal}
        transparent={true}
        animationType="slide"
        onRequestClose={handleCloseModal}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <ScrollView style={styles.notificationList}>
              {notifications.length > 0 ? (
                notifications.map((notification, index) => (
                  <Text key={index} style={styles.notificationText}>
                    {notification.content}
                  </Text>
                ))
              ) : (
                <Text style={styles.notificationText}>No notifications</Text>
              )}
            </ScrollView>
            <TouchableOpacity onPress={handleCloseModal} style={styles.closeButtonContainer}>
              <Text style={styles.closeButton}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <SettingsButton
        onBackgroundChange={handleBackgroundChange}
        onLanguageChange={handleLanguageChange}
        onSignOut={() => handleSignOut(navigation)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    height: 100,
    width: width,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    backgroundColor: '#c8cccc',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    position: 'absolute',
    zIndex: 1000,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
    marginTop: 50,
  },
  iconsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  notificationIconContainer: {
    position: 'relative',
    marginRight: 40,
    marginTop: 50,
  },
  notificationBadge: {
    position: 'absolute',
    top: -10,
    right: -10,
    backgroundColor: 'red',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationBadgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Dimmed background
  },
  modalContent: {
    width: width - 40,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  notificationList: {
    maxHeight: 300,
  },
  notificationText: {
    marginVertical: 5,
    fontSize: 14,
  },
  closeButtonContainer: {
    alignItems: 'center',
    marginTop: 10,
  },
  closeButton: {
    color: 'blue',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default CustomHeader;

