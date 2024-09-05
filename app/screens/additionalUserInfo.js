// import React, { useState } from 'react';
// import {
//   View,
//   Text,
//   TextInput,
//   Button,
//   StyleSheet,
//   TouchableOpacity,
//   Image,
//   Alert,
// } from 'react-native';
// import { ref, set } from 'firebase/database';
// import Firebase from '../config/firebase';
// import { useNavigation } from '@react-navigation/native';
// import { useCurrentLocation } from '../context/LocationContext'; // Import the Location Context
// import * as ImagePicker from 'expo-image-picker';
// import { uploadBytes, getDownloadURL } from 'firebase/storage';
// import uuid from 'react-native-uuid';

// const AdditionalInfo = () => {
//   const [age, setAge] = useState('');
//   const [gender, setGender] = useState('');
//   const [profileImage, setProfileImage] = useState(null); // Add state for profile image
//   const navigation = useNavigation();
//   const {
//     currentLocation,
//     hasLocationPermissions,
//     requestLocationPermissions,
//   } = useCurrentLocation(); // Access the location context

//   // Function to handle image upload to Firebase Storage
//   const uploadImageAsync = async (uri) => {
//     const response = await fetch(uri);
//     const blob = await response.blob();
//     const uniqueId = uuid.v4(); // Generate a unique ID for the image
//     const imageRef = ref(Firebase.Storage, `profileImages/${uniqueId}`); // Use uniqueId for storage path
//     await uploadBytes(imageRef, blob);
//     return await getDownloadURL(imageRef);
//   };

//   // Function to pick an image using ImagePicker
//   const pickImage = async () => {
//     let result = await ImagePicker.requestMediaLibraryPermissionsAsync();
//     if (result.granted === false) {
//       Alert.alert('Permission to access media library is required!');
//       return;
//     }
//     let pickerResult = await ImagePicker.launchImageLibraryAsync({
//       mediaTypes: ImagePicker.MediaTypeOptions.Images,
//       allowsEditing: true,
//       aspect: [4, 3],
//       quality: 1,
//     });
//     if (!pickerResult.canceled) {
//       setProfileImage(pickerResult.assets[0].uri); // Ensure correct URI is set
//     }
//   };

//   const handleSubmit = async () => {
//     const user = Firebase.Auth.currentUser;

//     if (user) {
//       if (!age || !gender) {
//         Alert.alert('Please fill in all the fields');
//         return;
//       }

//       if (!hasLocationPermissions) {
//         Alert.alert('Location permission is required');
//         await requestLocationPermissions();
//         return;
//       }

//       let profileImageUrl = '';
//       if (profileImage) {
//         profileImageUrl = await uploadImageAsync(profileImage); // Upload image and get the URL
//       }

//       const age = calculateAge(dateOfBirth);
//       if (age < minAge || age > maxAge) {
//         Alert.alert(
//           'Not at the appropriate age',
//           `You must be between ${minAge} and ${maxAge} to sign up`
//         );
//         return;
//       }

//       // Ensure currentLocation is valid
//       if (!currentLocation || !currentLocation.coords) {
//         Alert.alert('Location not available');
//         return;
//       }

//       const userRef = ref(Firebase.Database, `users/${user.uid}`);

//       const userData = {
//         email: user.email || 'Unknown Email',
//         username: user.displayName || 'Unknown',
//         firstName: user.displayName
//           ? user.displayName.split(' ')[0]
//           : 'Unknown',
//         lastName: user.displayName ? user.displayName.split(' ')[1] || '' : '',
//         age: age,
//         gender: gender,
//         currentLocation, // Make sure currentLocation is valid
//         profileImage: profileImageUrl || '', // Ensure there's a fallback
//       };

//       // Log the user data to check if it's correct before sending it to Firebase
//       console.log('User data being set:', userData);

//       // Set the data to Firebase and check for errors
//       try {
//         await set(userRef, userData);
//         // Navigate to Main Category Screen only if successful
//         navigation.navigate('Preferences');
//       } catch (error) {
//         console.error('Error updating user in Firebase:', error);
//         Alert.alert('Error updating user data');
//       }
//     } else {
//       Alert.alert('User is not logged in');
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <Text>
//         Please provide your age, gender, and profile image to complete your
//         profile:
//       </Text>

//       {/* Profile Image Section */}
//       <TouchableOpacity onPress={pickImage}>
//         {profileImage ? (
//           <Image source={{ uri: profileImage }} style={styles.profileImage} />
//         ) : (
//           <View style={styles.imagePlaceholder}>
//             <Text style={styles.imagePlaceholderText}>Pick an image</Text>
//           </View>
//         )}
//       </TouchableOpacity>

//       <TextInput
//         style={styles.input}
//         placeholder='Enter your age'
//         value={age}
//         onChangeText={setAge}
//         keyboardType='numeric'
//       />
//       <TextInput
//         style={styles.input}
//         placeholder='Enter your gender'
//         value={gender}
//         onChangeText={setGender}
//       />
//       <Button title='Submit' onPress={handleSubmit} />
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     padding: 20,
//   },
//   input: {
//     borderWidth: 1,
//     padding: 10,
//     marginVertical: 10,
//     width: '80%',
//     borderRadius: 8,
//   },
//   profileImage: {
//     width: 130,
//     height: 130,
//     borderRadius: 50,
//     marginBottom: 10,
//   },
//   imagePlaceholder: {
//     width: 130,
//     height: 130,
//     borderRadius: 65,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: 'gray',
//     marginBottom: 10,
//   },
//   imagePlaceholderText: {
//     color: 'white',
//     fontSize: 18,
//     fontWeight: 'bold',
//   },
// });

// export default AdditionalInfo;

import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
  Platform,
} from 'react-native';
import { ref, set } from 'firebase/database';
import Firebase from '../config/firebase';
import { useNavigation } from '@react-navigation/native';
import { useCurrentLocation } from '../context/LocationContext';
import * as ImagePicker from 'expo-image-picker';
import { uploadBytes, getDownloadURL } from 'firebase/storage';
import uuid from 'react-native-uuid';
import DateTimePicker from '@react-native-community/datetimepicker';

const AdditionalUserInfo = () => {
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [profileImage, setProfileImage] = useState(null); // Add state for profile image
  const [dateOfBirth, setDateOfBirth] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false); // State to manage Date Picker
  const navigation = useNavigation();
  const {
    currentLocation,
    hasLocationPermissions,
    requestLocationPermissions,
  } = useCurrentLocation(); // Access the location context

  const minAge = 18; // Minimum age requirement
  const maxAge = 120;

  // Function to handle image upload to Firebase Storage
  const uploadImageAsync = async (uri) => {
    const response = await fetch(uri);
    const blob = await response.blob();
    const uniqueId = uuid.v4(); // Generate a unique ID for the image
    const imageRef = ref(Firebase.Storage, `profileImages/${uniqueId}`); // Use uniqueId for storage path
    await uploadBytes(imageRef, blob);
    return await getDownloadURL(imageRef);
  };

  // Function to calculate age from date of birth
  const calculateAge = (dob) => {
    const today = new Date();
    const birthDate = new Date(dob);
    let userAge = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();
    if (
      monthDifference < 0 ||
      (monthDifference === 0 && today.getDate() < birthDate.getDate())
    ) {
      userAge--;
    }
    return userAge;
  };

  // Function to pick an image using ImagePicker
  const pickImage = async () => {
    let result = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (result.granted === false) {
      Alert.alert('Permission to access media library is required!');
      return;
    }
    let pickerResult = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    if (!pickerResult.canceled) {
      setProfileImage(pickerResult.assets[0].uri); // Ensure correct URI is set
    }
  };

  const showDatePickerHandler = () => {
    setShowDatePicker(true);
  };

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (selectedDate) {
      setDateOfBirth(selectedDate);
    }
  };

  const handleSubmit = async () => {
    const user = Firebase.Auth.currentUser;

    if (user) {
      // Calculate the age from the dateOfBirth
      const calculatedAge = calculateAge(dateOfBirth);

      // Validate the calculated age and gender
      if (calculatedAge < minAge || calculatedAge > maxAge) {
        Alert.alert(
          'Not at the appropriate age',
          `You must be between ${minAge} and ${maxAge} to sign up`
        );
        return;
      }

      if (!gender) {
        Alert.alert('Please select your gender');
        return;
      }

      if (!hasLocationPermissions) {
        Alert.alert('Location permission is required');
        await requestLocationPermissions();
        return;
      }

      let profileImageUrl = '';
      if (profileImage) {
        profileImageUrl = await uploadImageAsync(profileImage); // Upload image and get the URL
      }

      const userRef = ref(Firebase.Database, `users/${user.uid}`);

      const userData = {
        id: user.uid,
        email: user.email || 'Unknown Email',
        username: user.displayName || 'Unknown',
        firstName: user.displayName
          ? user.displayName.split(' ')[0]
          : 'Unknown',
        lastName: user.displayName ? user.displayName.split(' ')[1] || '' : '',
        age: calculatedAge, // Use calculated age
        gender: gender,
        currentLocation: currentLocation || {}, // Make sure currentLocation is valid
        profileImage: profileImageUrl || '', // Ensure there's a fallback
      };

      try {
        await set(userRef, userData);
        navigation.navigate('Preferences');
      } catch (error) {
        console.error('Error updating user in Firebase:', error);
        Alert.alert('Error updating user data');
      }
    } else {
      Alert.alert('User is not logged in');
    }
  };

  return (
    <View style={styles.container}>
      <Text>
        Please provide additional information to complete your profile:
      </Text>

      {/* Profile Image Section */}
      <TouchableOpacity onPress={pickImage}>
        {profileImage ? (
          <Image source={{ uri: profileImage }} style={styles.profileImage} />
        ) : (
          <View style={styles.imagePlaceholder}>
            <Text style={styles.imagePlaceholderText}>
              Pick a profile image
            </Text>
          </View>
        )}
      </TouchableOpacity>

      {/* Date of Birth Section */}
      <TouchableOpacity onPress={showDatePickerHandler} style={styles.input}>
        <Text>{`Date of Birth: ${dateOfBirth.toLocaleDateString()}`}</Text>
      </TouchableOpacity>
      {showDatePicker && (
        <DateTimePicker
          value={dateOfBirth}
          mode='date'
          display='default'
          onChange={handleDateChange}
        />
      )}

      {/* Gender Selection */}
      <View style={styles.genderContainer}>
        <TouchableOpacity
          style={[
            styles.genderButton,
            gender === 'Male' && styles.selectedGender,
          ]}
          onPress={() => setGender('Male')}
        >
          <Text style={styles.genderText}>Male</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.genderButton,
            gender === 'Female' && styles.selectedGender,
          ]}
          onPress={() => setGender('Female')}
        >
          <Text style={styles.genderText}>Female</Text>
        </TouchableOpacity>
      </View>

      {/* Submit Button */}
      <Button title='Submit' onPress={handleSubmit} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  input: {
    borderWidth: 1,
    padding: 10,
    marginVertical: 10,
    width: '80%',
    borderRadius: 8,
    justifyContent: 'center',
  },
  profileImage: {
    width: 130,
    height: 130,
    borderRadius: 50,
    marginBottom: 10,
  },
  imagePlaceholder: {
    width: 130,
    height: 130,
    borderRadius: 65,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'gray',
    marginBottom: 10,
  },
  imagePlaceholderText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  genderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '60%',
    marginVertical: 10,
  },
  genderButton: {
    flex: 1,
    padding: 8,
    marginHorizontal: 5,
    borderWidth: 2,
    borderColor: 'black',
    borderRadius: 10,
    alignItems: 'center',
  },
  selectedGender: {
    backgroundColor: 'lightblue',
  },
  genderText: {
    fontSize: 18,
  },
});

export default AdditionalUserInfo;
