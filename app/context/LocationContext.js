import React, { useEffect, useState } from "react";
import * as Location from "expo-location";
import { ref, set, update } from "firebase/database";
import Firebase from "../config/firebase";
import { useAuth } from "./AuthContext";
const LocationContext = React.createContext(null);

export const useCurrentLocation = () => {
  const context = React.useContext(LocationContext);
  if (!context) {
    throw new Error("Cannot use LocationContext outside of LocationContextProvider");
  }
  return context;
};
export const LocationContextProvider = ({ children }) => {
  const { user } = useAuth();

  const [interestRadius, setInterestRadius] = useState(0);
  const [hasLocationPermissions, setHasLocationPermissions] = useState(false);
  /**
   * @type [Location.LocationObject | undefined, any]
   */
  const [currentLocation, setCurrentLocation] = useState(undefined);
  /**
   * @type [Location.LocationSubscription | undefined, any]
   */
  const [subscription, setSubscription] = useState(undefined);

  const listenCurrentLocation = async () => {
    if (!hasLocationPermissions) {
      await requestLocationPermissions();
      return;
    }

    let locationSubscription = await Location.watchPositionAsync(
      {
        accuracy: Location.Accuracy.High,
        timeInterval: 10000, // 10 seconds
        distanceInterval: 20, // 20 meter
      },
      (location) => {
        setCurrentLocation(location);
      }
    );
    setSubscription(locationSubscription);
  };

  useEffect(() => {
    if (currentLocation && user) {
      const usersRef = ref(Firebase.Database, `users/${user.id}`); // Reference to user's data in the database
      update(usersRef, { currentLocation }); // Save user data in the database
    }
  }, [currentLocation, user]);

  useEffect(() => {
    if (hasLocationPermissions && !subscription) {
      listenCurrentLocation();
    }
    return () => {
      if (subscription) {
        subscription.remove();
      }
    };
  }, [hasLocationPermissions]);

  useEffect(() => {
    const requestLocationPermissions = async () => {
      const { status: currentStatus } = await Location.getForegroundPermissionsAsync();
      if (currentStatus === "granted") {
        setHasLocationPermissions(true);
        return;
      }
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === "granted") {
        setHasLocationPermissions(true);
        return;
      }
    };
    requestLocationPermissions();
  }, []);

  const requestLocationPermissions = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status === "granted") {
      setHasLocationPermissions(true);
      return;
    } else {
      setHasLocationPermissions(false);
    }
  };
  return (
    <LocationContext.Provider
      value={{
        hasLocationPermissions,
        requestLocationPermissions,
        currentLocation,
        setInterestRadius,
        interestRadius,
      }}
    >
      {children}
    </LocationContext.Provider>
  );
};
