import React from "react";

import { Text, View, StatusBar } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const NoActivePlayer = () => (
  <View
    style={{
      flex: 1,
      backgroundColor: "#F4511E",
      alignItems: "center",
      justifyContent: "center"
    }}
  >
    <StatusBar barStyle="light-content" />
    <MaterialCommunityIcons name="cloud-off-outline" size={96} color="#fff" />
    <Text style={{ fontSize: 16, color: "#fff", paddingVertical: 60 }}>
      No active player found...
    </Text>
  </View>
);

export default NoActivePlayer;
