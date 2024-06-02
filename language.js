import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
    en: {
        translation: {
            // English translations
            "What would you like to do?": "What would you like to do?",
            "Sign Out": "Sign Out",
            "Please select a category": "Please select a category",
            "Conversation": "Conversation",
            "Sport Activity": "Sport Activity",
            "Travel": "Travel",
            "Clubbing": "Clubbing",
            "Select": "Select",
            "What would you like to talk about?": "What would you like to talk about?",
            "Choose up to 3 topics": "Choose up to 3 topics",
            "Search category...": "Search category...",
        }
    },
    he: {
        translation: {
            // Hebrew translations
            "What would you like to do?": "מה תרצה לעשות?",
            "Sign Out": "התנתק",
            "Please select a category": "אנא בחר קטגוריה",
            "Conversation": "שיחה",
            "Sport Activity": "פעילות ספורטיבית",
            "Travel": "נסיעה",
            "Clubbing": "מועדונים",
            "Select": "בחר",
            "What would you like to talk about?": "על מה תרצה לדבר?",
            "Choose up to 3 topics": "בחר עד 3 נושאים",
            "Search category...": "חפש קטגוריה...",
        }
    }
};

i18n
    .use(initReactI18next)
    .init({
        resources,
        lng: 'en', // default language
        fallbackLng: 'en',
        interpolation: {
            escapeValue: false,
        },
    });

export default i18n;
