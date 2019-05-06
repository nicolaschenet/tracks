import React from "react";
import { View, Image } from "react-native";

const Cover = ({ track }) => (
  <View
    style={{
      flex: 3,
      justifyContent: "center",
      marginTop: 20,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 1,
      shadowRadius: 150
    }}
  >
    <Image
      source={{ uri: track.item.album.images[0].url }}
      style={{
        width: 320,
        height: 320
      }}
    />
  </View>
);

export default Cover;
