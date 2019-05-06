import React, { PureComponent } from "react";
import { View, TouchableOpacity, Text, Animated, Easing } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { MaterialIndicator } from "react-native-indicators";

class TrackControls extends PureComponent {
  state = {
    playPauseOffsetTop: new Animated.Value(50),
    playPauseOpacity: new Animated.Value(0),
    prevNextOffsetTop: new Animated.Value(50)
  };

  componentDidMount() {
    Animated.timing(this.state.playPauseOffsetTop, {
      toValue: 0,
      duration: 500,
      easing: Easing.elastic(2)
    }).start();
    Animated.timing(this.state.prevNextOffsetTop, {
      toValue: 0,
      duration: 600,
      easing: Easing.elastic(2)
    }).start();
    Animated.timing(this.state.playPauseOpacity, {
      toValue: 1,
      duration: 500
    }).start();
  }

  render() {
    const {
      communicating,
      playing,
      handleSkipToPrevious,
      handleSkipToNext,
      handlePlay,
      handlePause
    } = this.props;

    const {
      playPauseOffsetTop,
      playPauseOpacity,
      prevNextOffsetTop
    } = this.state;
    return (
      <View
        style={{
          flex: 1,
          width: 320,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-around",
          opacity: communicating ? 0.5 : 1
        }}
      >
        <TouchableOpacity onPress={handleSkipToPrevious}>
          <Animated.View style={{ top: prevNextOffsetTop }}>
            <MaterialCommunityIcons
              name="skip-previous"
              size={40}
              color={"#fff"}
              style={{ opacity: 0.75 }}
            />
          </Animated.View>
        </TouchableOpacity>
        <Animated.View
          style={{
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
            top: playPauseOffsetTop,
            opacity: playPauseOpacity
          }}
        >
          {!communicating && playing && (
            <TouchableOpacity onPress={handlePause}>
              <MaterialCommunityIcons
                name="pause-circle"
                size={80}
                color={"#fff"}
              />
            </TouchableOpacity>
          )}
          {!communicating && !playing && (
            <TouchableOpacity onPress={handlePlay}>
              <MaterialCommunityIcons
                name="play-circle"
                size={80}
                color={"#fff"}
              />
            </TouchableOpacity>
          )}
          {communicating && <MaterialIndicator color="#fff" size={60} />}
        </Animated.View>
        <TouchableOpacity onPress={handleSkipToNext}>
          <Animated.View style={{ top: prevNextOffsetTop }}>
            <MaterialCommunityIcons
              name="skip-next"
              size={40}
              color={"#fff"}
              style={{ opacity: 0.75 }}
            />
          </Animated.View>
        </TouchableOpacity>
      </View>
    );
  }
}

export default TrackControls;
