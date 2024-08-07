import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MatchesScreen from '../screens/Matches';
import MessagesScreen from '../screens/ConversationMatches';
import ProfileScreen from '../screens/ViewProfile';
import { Ionicons } from '@expo/vector-icons';

const Tab = createBottomTabNavigator();

const MyTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === 'Matches') {
            iconName = focused ? 'ios-heart' : 'ios-heart-outline';
          } else if (route.name === 'Messages') {
            iconName = focused ? 'ios-chatbubbles' : 'ios-chatbubbles-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'ios-person' : 'ios-person-outline';
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
      tabBarOptions={{
        activeTintColor: 'tomato',
        inactiveTintColor: 'gray',
      }}
    >
      <Tab.Screen name='Matches' component={MatchesScreen} />
      <Tab.Screen name='Messages' component={MessagesScreen} />
      <Tab.Screen name='Profile' component={ProfileScreen} />
    </Tab.Navigator>
  );
};

export default MyTabs;
