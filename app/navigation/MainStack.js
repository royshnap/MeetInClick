import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import AppTabs from './AppTabs';

// Screens:
import MainScreen from '../screens/Main';
import CustomHeader from './CustomHeader'; // Adjust the path accordingly
import SignUpScreen from '../screens/SignUp';
import ConversationMatches from '../screens/ConversationMatches';
import ViewProfile from '../screens/ViewProfile';
import PreferencesScreen from '../screens/MainCategories';
import SubCategoriesScreen from '../screens/SubCategories';
import Filter from '../screens/Filter';
import Conversation from '../screens/Conversation';
import AdditionalUserInfo from '../screens/additionalUserInfo';

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
        name='AdditionalUserInfo'
        component={AdditionalUserInfo}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name='Matches'
        component={ConversationMatches}
        options={{
          header: (props) => <CustomHeader {...props} />,
        }}
      />
      <Stack.Screen
        name='AppTabs'
        component={AppTabs}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name='Profile'
        component={ViewProfile}
        options={{
          header: (props) => <CustomHeader {...props} />,
        }}
      />
      <Stack.Screen
        name='Conversation'
        component={Conversation}
        options={{
          header: (props) => <CustomHeader {...props} />,
        }}
        //options={{ headerShown: true }}
      />
      <Stack.Screen
        name='Preferences'
        component={PreferencesScreen}
        options={{
          header: (props) => <CustomHeader {...props} />,
        }}
        //options={{ headerShown: true }}
      />
      <Stack.Screen
        name='SubCategories'
        component={SubCategoriesScreen}
        options={{
          header: (props) => <CustomHeader {...props} />,
        }}
        //options={{ headerShown: false }}
      />
      <Stack.Screen
        name='Filter'
        component={Filter}
        options={{
          header: (props) => <CustomHeader {...props} />,
        }}
        //options={{ headerShown: true }}
      />
    </Stack.Navigator>
  );
}
