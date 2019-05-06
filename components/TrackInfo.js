import React from "react";
import { View, Text } from "react-native";

const TrackInfo = ({ track }) => (
  <View
    style={{
      flex: 1,
      justifyContent: "center",
      alignItems: "center"
    }}
  >
    <Text
      style={{
        color: "#fff",
        fontSize: 24,
        fontWeight: "bold",
        textAlign: "center",
        marginBottom: 5
      }}
    >
      {track.item.name}
    </Text>
    <Text
      style={{
        color: "#fff",
        opacity: 0.6,
        fontSize: 16,
        textAlign: "center"
      }}
    >
      {track.item.artists[0].name}
    </Text>
  </View>
);

export default TrackInfo;
