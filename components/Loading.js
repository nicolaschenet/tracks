import React from "react";
import { Text, View, ImageBackground } from "react-native";
import { PulseIndicator } from "react-native-indicators";
import config from "../app.json";

const Loading = () => (
  <ImageBackground
    source={require("../assets/retro.jpg")}
    style={{ width: "100%", height: "100%" }}
  >
    <View
      style={{
        flex: 1,
        paddingBottom: 400
      }}
    >
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "space-around",
          flexDirection: "row"
        }}
      >
        <View style={{ width: 30, position: "absolute", paddingLeft: 50 }}>
          <PulseIndicator size={40} color="#fff" />
        </View>
        <View style={{}}>
          <Text
            style={{
              color: "#fff",
              fontFamily: "Futura-Medium",
              fontSize: 30,
              padding: 30,
              marginLeft: 50,
              textShadowColor: "#fff",
              textShadowOffset: { width: -1, height: 1 },
              textShadowRadius: 15
            }}
          >
            T R A C K S
          </Text>
        </View>
      </View>
    </View>
    <View
      style={{ alignItems: "center", justifyContent: "center", padding: 20 }}
    >
      <Text style={{ color: "rgba(255, 255, 255, 0.3)", fontSize: 10 }}>
        {config.expo.version}
      </Text>
    </View>
  </ImageBackground>
);

export default Loading;
