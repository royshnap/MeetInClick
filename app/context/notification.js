// 
import { ref, set , push } from "firebase/database";
import Firebase from "../config/firebase";

// Function to add a match notification
export const addMatchNotification = async (userId, userName) => {
  try {
    const matchRef = ref(Firebase.Database, `notification/${userId}/newMatches`);
    await push(matchRef, {
      type: 'newMatches',
      userName,
      timestamp: Date.now(),
    });
    console.log("Match notification added successfully");
  } catch (error) {
    console.error("Error adding match notification: ", error);
  }
};

// Function to add a message notification
export const addMessageNotification = async (userId, userName) => {
  try {
    const messageRef = ref(Firebase.Database, `notification/${userId}/newMessages`);
    await set(messageRef, {
      type: 'newMessages',
      userName,
      timestamp: Date.now(),
    });
    console.log("Message notification added successfully");
  } catch (error) {
    console.error("Error adding message notification: ", error);
  }
};
