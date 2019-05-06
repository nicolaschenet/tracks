import React, { PureComponent } from "react";
import { View, Text, Animated, Easing } from "react-native";
import ProgressBarAnimated from "react-native-progress-bar-animated";
import moment from "moment";

class TrackProgress extends PureComponent {
  state = {
    opacity: new Animated.Value(0)
  };

  componentDidMount() {
    Animated.timing(this.state.opacity, {
      toValue: 1,
      duration: 500,
      delay: 300
    }).start();
  }

  render() {
    const { track } = this.props;
    const { opacity } = this.state;
    return (
      <Animated.View
        style={{
          width: 320,
          marginVertical: 50,
          flexDirection: "row",
          alignItems: "center",
          opacity
        }}
      >
        <View
          style={{
            width: 40,
            alignItems: "flex-start",
            justifyContent: "center"
          }}
        >
          <Text
            style={{
              color: "rgba(255,255,255,0.5)",
              fontSize: 12
            }}
          >
            {moment.utc(track.progress_ms).format("m:ss")}
          </Text>
        </View>
        <View
          style={{
            flex: 1,
            borderRadius: 100,
            backgroundColor: "rgba(0,0,0,0.1)"
          }}
        >
          <ProgressBarAnimated
            backgroundColor="rgba(255,255,255,0.6)"
            height={3}
            borderWidth={0}
            width={240}
            value={(track.progress_ms / track.item.duration_ms) * 100}
          />
        </View>
        <View
          style={{
            width: 40,
            alignItems: "flex-end",
            justifyContent: "center"
          }}
        >
          <Text
            style={{
              color: "rgba(255,255,255,0.5)",
              fontSize: 12
            }}
          >
            {moment.utc(track.item.duration_ms).format("m:ss")}
          </Text>
        </View>
      </Animated.View>
    );
  }
}

export default TrackProgress;
