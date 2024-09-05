import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import * as Notifications from 'expo-notifications';

const NotificationHandler = ({ navigation }) => {
  const [notificationCount, setNotificationCount] = useState(0);

  useEffect(() => {
    const subscription = Notifications.addNotificationReceivedListener(
      (notification) => {
        setNotificationCount((currentCount) => currentCount + 1);
      }
    );

    const responseListener =
      Notifications.addNotificationResponseReceivedListener((response) => {
        setNotificationCount(0); // Reset notification count when user interacts
        navigation.navigate('NotificationsScreen'); // Assuming you have a NotificationsScreen
      });

    return () => {
      subscription.remove();
      responseListener.remove();
    };
  }, []);

  const handlePress = () => {
    setNotificationCount(0); // Reset count when viewed
    navigation.navigate('NotificationsScreen'); // Navigate to notifications view
  };

  return (
    <TouchableOpacity onPress={handlePress} style={styles.container}>
      <Text>Notifications</Text>
      {notificationCount > 0 && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{notificationCount}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    right: -6,
    top: -3,
    backgroundColor: 'red',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
});

export default NotificationHandler;
