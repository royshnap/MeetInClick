import 'intl-pluralrules'; // Add this line at the top
import React from 'react';
import { I18nextProvider } from 'react-i18next';
import i18n from './i18n';
import { FacebookLoginProvider } from './app/context/FacebookLogin';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import FilterScreen from './app/screens/Filter';
import SignUpScreen from './app/screens/SignUp';
import ViewProfile from './app/screens/ViewProfile';
import SubCategoriesScreen from './app/screens/SubCategories';
import MainCategoriesScreen from './app/screens/MainCategories';
import MainScreen from './app/screens/Main';
import { SettingsProvider } from './app/components/useSettings';
import { AuthContextProvider } from './app/context/AuthContext';
import { ProfileHeader } from './app/components/ProfileHeader'; // Add this line
import { ConversationContextProvider } from './app/context/ConversationContext';
import ConversationMatches from './app/screens/ConversationMatches';
import Conversation from './app/screens/Conversation';
import { LocationContextProvider } from './app/context/LocationContext';

const Stack = createStackNavigator();

export default function App() {
  return (
    <AuthContextProvider>
      <I18nextProvider i18n={i18n}>
        <SettingsProvider>
          <FacebookLoginProvider>
            <NavigationContainer>
              <ConversationContextProvider>
                <LocationContextProvider>
                  <Stack.Navigator initialRouteName='Main'>
                    <Stack.Screen name='ViewProfile' component={ViewProfile} />
                    <Stack.Screen
                      name='ConversationMatches'
                      component={ConversationMatches}
                    />
                    <Stack.Screen name='Filter' component={FilterScreen} />
                    <Stack.Screen
                      name='SubCategories'
                      component={SubCategoriesScreen}
                    />
                    <Stack.Screen
                      name='MainCategories'
                      component={MainCategoriesScreen}
                    />
                    <Stack.Screen
                      name='Conversation'
                      component={Conversation}
                    />
                    <Stack.Screen
                      name='Main'
                      component={MainScreen}
                      options={{ headerShown: false }}
                    />
                    <Stack.Screen name='SignUp' component={SignUpScreen} />
                  </Stack.Navigator>
                </LocationContextProvider>
              </ConversationContextProvider>
            </NavigationContainer>
          </FacebookLoginProvider>
        </SettingsProvider>
      </I18nextProvider>
    </AuthContextProvider>
  );
}
