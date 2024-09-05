import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const HeaderRight = () => {
  const navigation = useNavigation();

  return (
    <View style={{ flexDirection: 'row', marginRight: 10 }}>
      <TouchableOpacity onPress={() => navigation.navigate('SettingsScreen')}>
        <Ionicons
          name='settings-outline'
          size={24}
          style={{ marginHorizontal: 10 }}
        />
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => navigation.navigate('NotificationsScreen')}
      >
        <Ionicons
          name='notifications-outline'
          size={24}
          style={{ marginHorizontal: 10 }}
        />
      </TouchableOpacity>
    </View>
  );
};

export default HeaderRight;
