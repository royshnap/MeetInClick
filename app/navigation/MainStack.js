import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import AppTabs from './AppTabs';

// Screens:
import MainScreen from '../screens/Main';
import SignUpScreen from '../screens/SignUp';
import ViewProfileScreen from '../screens/ViewProfile';
import PreferencesScreen from '../screens/MainCategories';
import SubCategoriesScreen from '../screens/SubCategories';
import FilterScreen from '../screens/Filter';
import MatchesScreen from '../screens/Matches';
import ConversationScreen from '../screens/Conversation';

const Stack = createStackNavigator();

export default function MainStack() {
  return (
    <Stack.Navigator initialRouteName='Main'>
      <Stack.Screen
        name='Main'
        component={MainScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name='SignUp'
        component={SignUpScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name='AppTabs'
        component={AppTabs}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name='Profile'
        component={ViewProfileScreen}
        options={{ headerShown: true }}
      />
      <Stack.Screen
        name='Matches'
        component={MatchesScreen}
        options={{ headerShown: true }}
      />
      <Stack.Screen
        name='Conversation'
        component={ConversationScreen}
        options={{ headerShown: true }}
      />
      <Stack.Screen
        name='Preferences'
        component={PreferencesScreen}
        options={{ headerShown: true }}
      />
      <Stack.Screen
        name='SubCategories'
        component={SubCategoriesScreen}
        options={{ headerShown: true }}
      />
      <Stack.Screen
        name='Filter'
        component={FilterScreen}
        options={{ headerShown: true }}
      />
    </Stack.Navigator>
  );
}
