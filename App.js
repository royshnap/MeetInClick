import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { View, Text } from "react-native";
import LocationScreen from "./app/screens/LocationScreen";
import SignUpScreen from "./app/screens/SignUpScreen";
import SubCategoriesScreen from "./app/screens/SubCategoriesScreen";
import MainCategoriesScreen from "./app/screens/MainCategoriesScreen";
import MainScreen from "./app/screens/MainScreen";
import { AuthContextProvider } from "./app/context/AuthContext";
import { ConversationContextProvider } from "./app/context/ConversationContext";
import ConversationMatches from "./app/screens/ConversationMatches";
import Conversation from "./app/screens/Conversation";

const Stack = createStackNavigator();

const Conversations = () => {
  return (
    <View>
      <Text>TODO: Implement conversation list</Text>
    </View>
  );
};

export default function App() {
  return (
    <NavigationContainer>
      <AuthContextProvider>
        <ConversationContextProvider>
          <Stack.Navigator initialRouteName="Main">
            <Stack.Screen name="ConversationMatches" component={ConversationMatches} />
            <Stack.Screen name="Location" component={LocationScreen} />
            <Stack.Screen name="SubCategories" component={SubCategoriesScreen} />
            <Stack.Screen name="MainCategories" component={MainCategoriesScreen} />
            <Stack.Screen name="Conversation" component={Conversation} />
            <Stack.Screen name="Conversations" component={Conversations} />
            <Stack.Screen name="SignUp" component={SignUpScreen} />
            <Stack.Screen name="Main" component={MainScreen} options={{ headerShown: false }} />
          </Stack.Navigator>
        </ConversationContextProvider>
      </AuthContextProvider>
    </NavigationContainer>
  );
}
