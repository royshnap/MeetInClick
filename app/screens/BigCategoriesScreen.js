// import React, { useState } from 'react';
// import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';

// const BigCategoriesScreen = () => {
//     const [selectedCategory, setSelectedCategory] = useState('');

//     const categories = [
//         'Conversation',
//         'Sport Activity',
//         'Travel',
//         'Clubbing',
//         // Add more categories as needed
//     ];

//     const handleCategorySelect = (category) => {
//         setSelectedCategory(category);
//     };

//     return (
//         <View style={styles.container}>
//             <Text style={styles.title}>Choose a Category</Text>
//             <ScrollView style={styles.categoryContainer}>
//                 {categories.map((category, index) => (
//                     <TouchableOpacity
//                         key={index}
//                         style={[styles.categoryItem, selectedCategory === category && styles.selectedCategoryItem]}
//                         onPress={() => handleCategorySelect(category)}
//                     >
//                         <Text style={styles.categoryText}>{category}</Text>
//                     </TouchableOpacity>
//                 ))}
//             </ScrollView>
//             {selectedCategory !== '' && (
//                 <View style={styles.selectedCategoryContainer}>
//                     <Text style={styles.selectedCategoryText}>Selected Category: {selectedCategory}</Text>
//                 </View>
//             )}
//         </View>
//     );
// };

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         justifyContent: 'center',
//         alignItems: 'center',
//     },
//     title: {
//         fontSize: 24,
//         fontWeight: 'bold',
//         marginBottom: 20,
//     },
//     categoryContainer: {
//         width: '80%',
//         maxHeight: 200,
//         borderWidth: 1,
//         borderColor: 'gray',
//         borderRadius: 10,
//         padding: 10,
//         marginBottom: 20,
//     },
//     categoryItem: {
//         paddingVertical: 10,
//         borderBottomWidth: 1,
//         borderBottomColor: 'lightgray',
//     },
//     selectedCategoryItem: {
//         backgroundColor: 'lightblue',
//     },
//     categoryText: {
//         fontSize: 18,
//     },
//     selectedCategoryContainer: {
//         alignItems: 'center',
//     },
//     selectedCategoryText: {
//         fontSize: 20,
//         fontWeight: 'bold',
//     },
// });

// export default BigCategoriesScreen;
