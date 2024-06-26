import 'intl-pluralrules'; // Add this line at the top
import React from "react";
import { I18nextProvider } from 'react-i18next';
import i18n from './i18n';
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import LocationScreen from "./app/screens/LocationScreen";
import SignUpScreen from "./app/screens/SignUpScreen";
import UserScreen from "./app/screens/UserScreen";
import SubCategoriesScreen from "./app/screens/SubCategoriesScreen";
import MainCategoriesScreen from "./app/screens/MainCategoriesScreen";
import MainScreen from "./app/screens/MainScreen";
import { SettingsProvider } from "./app/components/useSettings";
import { AuthContextProvider } from "./app/context/AuthContext";
import {ProfileHeader} from "./app/components/ProfileHeader";
import { ConversationContextProvider } from "./app/context/ConversationContext";
import ConversationMatches from "./app/screens/ConversationMatches";
import Conversation from "./app/screens/Conversation";
import { LocationContextProvider } from "./app/context/LocationContext";

const Stack = createStackNavigator();

export default function App() {
  return (
    <AuthContextProvider>
    <I18nextProvider i18n={i18n}>
    <SettingsProvider>
      <NavigationContainer>
            <ConversationContextProvider>
              <LocationContextProvider>
                <Stack.Navigator initialRouteName="Main">
                  <Stack.Screen name="UserScreen" component={UserScreen} />
                  <Stack.Screen name="ConversationMatches" component={ConversationMatches} />
                  <Stack.Screen name="Location" component={LocationScreen} />
                  <Stack.Screen name="SubCategories" component={SubCategoriesScreen} />
                  <Stack.Screen name="MainCategories" component={MainCategoriesScreen} />
                  <Stack.Screen name="Conversation" component={Conversation} />
                  <Stack.Screen name="Main" component={MainScreen} options={{ headerShown: false }} />
                  <Stack.Screen name="SignUp" component={SignUpScreen} />
                </Stack.Navigator>
              </LocationContextProvider>
            </ConversationContextProvider>
      </NavigationContainer>
      </SettingsProvider>

    </I18nextProvider>
    </AuthContextProvider>

  );
}
