import { initializeApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  initializeAuth,
  getReactNativePersistence,
} from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import { getDatabase } from 'firebase/database';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: 'AIzaSyAUiO1xapzn79QNxQEy6k23pvmX2lcXJ0o',
  authDomain: 'meetinclick.firebaseapp.com',
  databaseURL:
    'https://meetinclick-default-rtdb.europe-west1.firebasedatabase.app',
  projectId: 'meetinclick',
  storageBucket: 'meetinclick.appspot.com',
  messagingSenderId: '1010390116818',
  appId: '1:1010390116818:web:f8e38c69140e4470e0400b',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});
const googleAuthProvider = new GoogleAuthProvider();
const database = getDatabase(app);
const storage = getStorage(app);

const Firebase = {
  Auth: auth,
  GoogleAuthProvider: googleAuthProvider,
  Database: database,
  Storage: storage,
};

export default Firebase;
