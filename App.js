import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LocationScreen from './app/screens/LocationScreen';
import SignUpScreen from './app/screens/SignUpScreen';
import SubCategoriesScreen from './app/screens/SubCategoriesScreen';
import MainCategoriesScreen from './app/screens/MainCategoriesScreen';
import MainScreen from './app/screens/MainScreen';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Main">
        <Stack.Screen name="Location" component={LocationScreen} />
        <Stack.Screen name="SignUp" component={SignUpScreen} />
        <Stack.Screen name="MainCategories" component={MainCategoriesScreen} />
        <Stack.Screen name="SubCategories" component={SubCategoriesScreen} />
        <Stack.Screen name="Main" component={MainScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
