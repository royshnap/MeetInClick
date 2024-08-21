import 'intl-pluralrules';
import React from 'react';
import { I18nextProvider } from 'react-i18next';
import i18n from './i18n';
import { SettingsProvider } from './app/components/useSettings';
import { AuthContextProvider } from './app/context/AuthContext';
import { ConversationContextProvider } from './app/context/ConversationContext';
import { LocationContextProvider } from './app/context/LocationContext';
import Navigation from './app/navigation';

export default function App() {
  return (
    <AuthContextProvider>
      <I18nextProvider i18n={i18n}>
        <SettingsProvider>
          <ConversationContextProvider>
            <LocationContextProvider>
              <Navigation />
            </LocationContextProvider>
          </ConversationContextProvider>
        </SettingsProvider>
      </I18nextProvider>
    </AuthContextProvider>
  );
}
