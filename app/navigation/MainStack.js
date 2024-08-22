import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import AppTabs from './AppTabs';

// Screens:
import MainScreen from '../screens/Main';
import SignUpScreen from '../screens/SignUp';
import WelcomeBack from '../screens/WelcomeBack';
import ConversationMatches from '../screens/ConversationMatches';
import ViewProfile from '../screens/ViewProfile';
import PreferencesScreen from '../screens/MainCategories';
import SubCategoriesScreen from '../screens/SubCategories';
import Filter from '../screens/Filter';
import Conversation from '../screens/Conversation';

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
      <Stack.Screen name='Matches' component={ConversationMatches} />
      <Stack.Screen
        name='AppTabs'
        component={AppTabs}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name='Profile'
        component={ViewProfile}
        options={{ headerShown: true }}
      />
      <Stack.Screen
        name='Conversation'
        component={Conversation}
        options={{ headerShown: true }}
      />
      <Stack.Screen
        name='Preferences'
        component={PreferencesScreen}
        options={{ headerShown: true }}
      />
      <Stack.Screen
        name='WelcomeBack'
        component={WelcomeBack}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name='SubCategories'
        component={SubCategoriesScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name='Filter'
        component={Filter}
        options={{ headerShown: true }}
      />
    </Stack.Navigator>
  );
}
