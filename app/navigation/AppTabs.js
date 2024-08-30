import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import CustomHeader from './CustomHeader';
import { useTranslation } from 'react-i18next';

// Screens:
import ViewProfile from '../screens/ViewProfile';
import ConversationMatches from '../screens/ConversationMatches';
import PreferencesScreen from '../screens/MainCategories';
import Filter from '../screens/Filter'; 

const Tab = createBottomTabNavigator();

export default function AppTabs() {
    const { t } = useTranslation();

  return (
    <Tab.Navigator
      //initialRouteName='Profile'
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
            case 'Filters':
              iconName = focused ? 'filter' : 'filter-outline';
              break;
            default:
              iconName = 'alert-circle';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: 'navy',
        tabBarInactiveTintColor: 'black',
        tabBarLabelStyle: { fontSize: 14 },
        tabBarStyle: { backgroundColor: '#c8cccc', paddingBottom: 20, height: 80 },
        header: (props) => <CustomHeader {...props} />,
      })}
    >
      <Tab.Screen name="Profile" component={ViewProfile} options={{ title: t('Profile') }} />
      <Tab.Screen name="Preferences" component={PreferencesScreen} options={{ title: t('Preferences') }} />
      <Tab.Screen name="Filters" component={Filter} options={{ title: t('Filters') }} />
      <Tab.Screen name="Matches" component={ConversationMatches} options={{ title: t('Matches') }} />
    </Tab.Navigator>
  );
}

