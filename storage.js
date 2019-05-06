import { AsyncStorage } from "react-native";

export const setUserData = async (key, value) => {
  try {
    await AsyncStorage.setItem(key, "" + value);
  } catch (err) {
    console.log("[ERROR] Storage:setUserData", err);
  }
};

export const getUserData = async key => {
  try {
    const value = await AsyncStorage.getItem(key);
    return value;
  } catch (err) {
    console.log("[ERROR] Storage:getUserData", err);
  }
};
