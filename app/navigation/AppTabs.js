import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';

// Screens:
import ViewProfile from '../screens/ViewProfile';
import ConversationMatches from '../screens/ConversationMatches';
import PreferencesScreen from '../screens/MainCategories';
import Filter from '../screens/Filter';  // Import the Filter screen

const Tab = createBottomTabNavigator();

export default function AppTabs() {
  return (
    <Tab.Navigator
      initialRouteName='Profile'
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          switch (route.name) {
            case 'Profile':
              iconName = focused ? 'person' : 'person-outline';
              break;
            case 'Preferences':
              iconName = focused ? 'grid' : 'grid-outline';
              break;
            case 'Matches':
              iconName = focused ? 'chatbox' : 'chatbox-outline';
              break;
            case 'Filters':  // Icon for Filter screen
              iconName = focused ? 'filter' : 'filter-outline';
              break;
            default:
              iconName = 'alert-circle';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: 'navy',
        tabBarInactiveTintColor: 'gray',
        tabBarLabelStyle: { fontSize: 12 },
        tabBarStyle: { paddingBottom: 5, height: 70 },
        headerShown: true,
      })}
    >
      <Tab.Screen name='Profile' component={ViewProfile} />
      <Tab.Screen name='Preferences' component={PreferencesScreen} />
      <Tab.Screen name='Filters' component={Filter} />
      <Tab.Screen name='Matches' component={ConversationMatches} />
    </Tab.Navigator>
  );
}
