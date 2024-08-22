import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';

// Screens:
import ViewProfile from '../screens/ViewProfile';
import ConversationMatches from '../screens/ConversationMatches';
import PreferencesScreen from '../screens/MainCategories';

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
            default:
              iconName = 'alert-circle';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: 'navy',
        tabBarInactiveTintColor: 'gray',
        tabBarLabelStyle: { fontSize: 12 },
        tabBarStyle: { paddingBottom: 5, height: 70 },
        headerShown: false,
      })}
    >
      <Tab.Screen name='Profile' component={ViewProfile} />
      <Tab.Screen name='Preferences' component={PreferencesScreen} />
      <Tab.Screen name='Matches' component={ConversationMatches} />
    </Tab.Navigator>
  );
}
