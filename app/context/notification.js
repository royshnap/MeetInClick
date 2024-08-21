// 
import { ref, set , push, get } from "firebase/database";
import Firebase from "../config/firebase";

export const addMatchNotification = async (userId, userName) => {
  try {
    const matchRef = ref(Firebase.Database, `notification/${userId}/newMatches`);
    
    // Check if a match with the same username already exists
    const snapshot = await get(matchRef);
    let exists = false;

    snapshot.forEach((childSnapshot) => {
      const notification = childSnapshot.val();
      if (notification.userName === userName) {
        exists = true;
        return true; // Break the loop
      }
    });

    // If the match doesn't exist, add a new notification
    if (!exists) {
      await push(matchRef, {
        type: 'newMatches',
        userName,
        timestamp: Date.now(),
      });
    } else {
      console.log("Match notification already exists, not adding again.");
    }
  } catch (error) {
    console.error("Error adding match notification: ", error);
  }
};

// Function to add a message notification
export const addMessageNotification = async (userId, userName) => {
  try {
    const messageRef = ref(Firebase.Database, `notification/${userId}/newMessages`);

    // Check if a message notification with the same username already exists
    const snapshot = await get(messageRef);
    let exists = false;

    snapshot.forEach((childSnapshot) => {
      const notification = childSnapshot.val();
      if (notification.userName === userName) {
        exists = true;
        return true; // Break the loop
      }
    });

    // If the message doesn't exist, add a new notification
    if (!exists) {
      await push(messageRef, {
        type: 'newMessages',
        userName,
        timestamp: Date.now(),
      });
    } else {
      console.log("Message notification already exists, not adding again.");
    }
  } catch (error) {
    console.error("Error adding message notification: ", error);
  }
};