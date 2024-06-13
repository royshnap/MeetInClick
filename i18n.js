import 'intl-pluralrules';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
    en: {
        translation: {
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
            // Added translations for MainScreen
            "Email address": "Email address",
            "Password": "Password",
            "Login": "Login",
            "or Login with": "or Login with",
            "Sign Up with Facebook": "Sign Up with Facebook",
            "Sign Up with Gmail": "Sign Up with Gmail",
            "Don't have a User?": "Don't have a User?",
            "Sign Up": "Sign Up",
            "Change Language": "Change Language",
            //sub categories scree:
            "What are your preferences?": "What are your preferences?",
            "Choose up to 5 topics": "Choose up to 5 topics",
            "Search category...": "Search category...",
            "You can select up to 5 topics.": "You can select up to 5 topics.",
            "No matches found for the selected topics.": "No matches found for the selected topics.",
            "Please select at least one topic.": "Please select at least one topic.",
            //conversation category:
            "Travel": "Travel",
            "Books": "Books",
            "Music": "Music",
            "Movies": "Movies",
            "Hobbies": "Hobbies",
            "Food": "Food",
            "Technology": "Technology",
            "Career": "Career",
            "Childhood": "Childhood",
            "Health": "Health",
            "Relationships": "Relationships",
            "Culture": "Culture",
            "Fashion": "Fashion",
            "Goals": "Goals",
            "Politics": "Politics",
            "Psychology": "Psychology",
            "News": "News",
            "Sports": "Sports",
            "Business": "Business",
            "Art": "Art",
            "Philosophy": "Philosophy",
            "Nature": "Nature",
            "Social": "Social",
            "Education": "Education",
            "Funny": "Funny",
            "Achievements": "Achievements",
            "Anime": "Anime",
            "Netflix": "Netflix",
            "Languages": "Languages",
            "Pets": "Pets",
            "Science": "Science",
            "Dreams": "Dreams",
            "Traditions": "Traditions",
            "Concerts": "Concerts",
            "Inspiration": "Inspiration",
            "Finance": "Finance",
            "Vacations": "Vacations",
            "Quotes": "Quotes",
            "Fitness": "Fitness",
            "Adventure": "Adventure",
            "Creativity": "Creativity",
            //sport activities categories:
            "Running": "Running",
            "Swimming": "Swimming",
            "Cycling": "Cycling",
            "Yoga": "Yoga",
            "Weightlifting": "Weightlifting",
            "Dancing": "Dancing",
            "Hiking": "Hiking",
            "Soccer": "Soccer",
            "Basketball": "Basketball",
            "Tennis": "Tennis",
            "Badminton": "Badminton",
            "Cricket": "Cricket",
            "Baseball": "Baseball",
            "Rugby": "Rugby",
            "Table Tennis": "Table Tennis",
            "Volleyball": "Volleyball",
            "Skiing": "Skiing",
            "Snowboarding": "Snowboarding",
            "Skating": "Skating",
            "Martial Arts": "Martial Arts",
            "Boxing": "Boxing",
            "Climbing": "Climbing",
            "Golf": "Golf",
            "Horse Riding": "Horse Riding",
            //travel category:
            "Adventure": "Adventure",
            "Beach": "Beach",
            "Historical": "Historical",
            "Cultural": "Cultural",
            "Nature": "Nature",
            "Road Trip": "Road Trip",
            "Cruise": "Cruise",
            "Backpacking": "Backpacking",
            "Luxury": "Luxury",
            "Camping": "Camping",
            "Solo Travel": "Solo Travel",
            "Family Travel": "Family Travel",
            "Romantic Getaway": "Romantic Getaway",
            "Business Travel": "Business Travel",
            "Group Travel": "Group Travel",
            "Eco Travel": "Eco Travel",
            "Wildlife": "Wildlife",
            "Urban Exploration": "Urban Exploration",
            "Food and Drink": "Food and Drink",
            "Festival Travel": "Festival Travel",
            //clubbing category:
            "Nightclubs": "Nightclubs",
            "Bars": "Bars",
            "Pubs": "Pubs",
            "Live Music": "Live Music",
            "Dance Clubs": "Dance Clubs",
            "Themed Parties": "Themed Parties",
            "Karaoke": "Karaoke",
            "Lounge Bars": "Lounge Bars",
            "Rooftop Bars": "Rooftop Bars",
            "Beach Clubs": "Beach Clubs",
            "Pool Parties": "Pool Parties",
            "Cocktail Bars": "Cocktail Bars",
            "Discos": "Discos",
            "After Hours Clubs": "After Hours Clubs",
            "Jazz Clubs": "Jazz Clubs",
            "Comedy Clubs": "Comedy Clubs"
        }
    },
    he: {
        translation: {
            "Change Background": "החלף רקע",
            "What would you": "מה תרצה",
            "like to do?": "לעשות?",
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
            // Added translations for MainScreen
            "Email address": "כתובת אימייל",
            "Password": "סיסמה",
            "Login": "התחבר",
            "or Login with": "או התחבר באמצעות",
            "Sign Up with Facebook": "הירשם באמצעות פייסבוק",
            "Sign Up with Gmail": "הירשם באמצעות ג'ימייל",
            "Don't have a User?": "אין לך משתמש?",
            "Sign Up": "הרשמה",
            "Change Language": "שנה שפה",
            // sub category screen:
            "What are your preferences?": "מהן ההעדפות שלך?",
            "Choose up to 5 topics": "בחר עד 5 נושאים",
            "Search category...": "מחפש קטגוריה...",
            "You can select up to 5 topics.": "תוכל לבחור עד חמישה נושאים.",
            "No matches found for the selected topics.": "לא נמצאו התאמות עבור הנושאים שנבחרו.",
            "Please select at least one topic.": "בחר לפחות נושא אחד.",
            // conversation category:
            "Travel": "נסיעה",
            "Books": "ספרים",
            "Music": "מוזיקה",
            "Movies": "סרטים",
            "Hobbies": "תחביבים",
            "Food": "אוכל",
            "Technology": "טכנולוגיה",
            "Career": "קריירה",
            "Childhood": "ילדות",
            "Health": "בריאות",
            "Relationships": "יחסים",
            "Culture": "תרבות",
            "Fashion": "אופנה",
            "Goals": "מטרות",
            "Politics": "פוליטיקה",
            "Psychology": "פסיכולוגיה",
            "News": "חדשות",
            "Sports": "ספורט",
            "Business": "עסקים",
            "Art": "אמנות",
            "Philosophy": "פילוסופיה",
            "Nature": "טבע",
            "Social": "חברתי",
            "Education": "חינוך",
            "Funny": "מצחיק",
            "Achievements": "הישגים",
            "Anime": "אנימה",
            "Netflix": "נטפליקס",
            "Languages": "שפות",
            "Pets": "חיות מחמד",
            "Science": "מדע",
            "Dreams": "חלומות",
            "Traditions": "מסורות",
            "Concerts": "הופעות",
            "Inspiration": "השראה",
            "Finance": "פיננסים",
            "Vacations": "חופשות",
            "Quotes": "ציטוטים",
            "Fitness": "כושר",
            "Adventure": "הרפתקאות",
            "Creativity": "יצירתיות",
            //sports activities category:
            "Running": "ריצה",
            "Swimming": "שחייה",
            "Cycling": "רכיבה על אופניים",
            "Yoga": "יוגה",
            "Weightlifting": "הרמת משקולות",
            "Dancing": "ריקודים",
            "Hiking": "טיולים בהרים",
            "Soccer": "כדורגל",
            "Basketball": "כדורסל",
            "Tennis": "טניס",
            "Badminton": "בדמינטון",
            "Cricket": "קריקט",
            "Baseball": "בייסבול",
            "Rugby": "רוגבי",
            "Table Tennis": "טניס שולחן",
            "Volleyball": "כדורעף",
            "Skiing": "סקי",
            "Snowboarding": "סנובורד",
            "Skating": "סקייטבורד",
            "Martial Arts": "אומנויות לחימה",
            "Boxing": "אירובי",
            "Climbing": "טיפוס",
            "Golf": "גולף",
            "Horse Riding": "רכיבת סוסים",
            //travel category:
            "Adventure": "הרפתקאות",
            "Beach": "חוף",
            "Historical": "היסטורי",
            "Cultural": "תרבותי",
            "Nature": "טבע",
            "Road Trip": "טיול בדרכים",
            "Cruise": "טיול קרוז",
            "Backpacking": "טיול גב",
            "Luxury": "תיירות יוקרה",
            "Camping": "טיול בטבע",
            "Solo Travel": "טיול לבד",
            "Family Travel": "טיול משפחתי",
            "Romantic Getaway": "בריחת רומנטיקה",
            "Business Travel": "טיול עסקי",
            "Group Travel": "טיול קבוצתי",
            "Eco Travel": "טיול אקולוגי",
            "Wildlife": "חי בר",
            "Urban Exploration": "חקירת ערים",
            "Food and Drink": "אוכל ומשקאות",
            "Festival Travel": "טיול לפסטיבלים",
            //clubbing category:
            "Nightclubs": "מועדונים לילה",
            "Bars": "ברים",
            "Pubs": "פאבים",
            "Live Music": "מוזיקה חיה",
            "Dance Clubs": "מועדוני ריקודים",
            "Themed Parties": "מסיבות עם נושא",
            "Karaoke": "קריוקי",
            "Lounge Bars": "ברים סלון",
            "Rooftop Bars": "ברים על הגג",
            "Beach Clubs": "מועדונים בחוף",
            "Pool Parties": "מסיבות בבריכה",
            "Cocktail Bars": "ברים קוקטיילים",
            "Discos": "דיסקותק",
            "After Hours Clubs": "מועדונים אחרי שעות",
            "Jazz Clubs": "מועדוני ג'אז",
            "Comedy Clubs": "מועדוני סטנד-אפ",
            //settings:
            "Background": "רקע",
            //location screen:
            "Selected distance": "המרחק הנבחר",
            "meters": "מטרים",
            "Back": "חזרה",
            "OK": "אישור",
            "Choose the distance": "בחר את המרחק",
            "Distance": "מרחק",
            "Set": "הגדר",
            //conversation screen:
            "User name": "שם משתמש",
            "Topics": "נושאים",
            "Start conversation": "התחל שיחה",
            "Status: Approved": "סטטוס: מאושר",
            "Status: Declined": "סטטוס: נדחה",
            "Status: Pending": "סטטוס: בהמתנה",
            "Send conversation request": "שלח בקשת שיחה",
            "Request has been sent to": "הבקשה נשלחה ל",
            "There was a problem starting conversation with": "הייתה בעיה בהתחלת השיחה עם",
            "There was a problem sending conversation request to": "הייתה בעיה בשליחת בקשת השיחה ל",
            "No matches found for the selected topics.": "לא נמצאו התאמות לנושאים שנבחרו.",
            "Matches": "התאמות"

        }
    }
};
i18n.use(initReactI18next)
  .init({
    resources,
    lng: 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
