import React, { PureComponent } from "react";
import { Animated, Image, Text, TouchableOpacity, View } from "react-native";

class RecentlyPlayedItem extends PureComponent {
  state = {
    scaleValue: new Animated.Value(0)
  };

  componentDidMount() {
    const { index } = this.props;
    const { scaleValue } = this.state;
    Animated.timing(scaleValue, {
      toValue: 1,
      duration: 600,
      delay: index * 350
    }).start();
  }

  render() {
    const {
      children,
      item: { track },
      onPress
    } = this.props;
    const { scaleValue } = this.state;
    return (
      <Animated.View style={{ opacity: scaleValue }}>
        <TouchableOpacity
          style={{
            flexDirection: "row",
            alignItems: "center",
            padding: 20
          }}
          onPress={onPress}
        >
          <Image
            source={{ uri: track.album.images[0].url }}
            style={{
              width: 80,
              height: 80
            }}
          />
          <View style={{ flex: 1, padding: 20 }}>
            <Text
              numberOfLines={1}
              ellipsizeMode="middle"
              style={{ color: "#fff", fontSize: 16, marginBottom: 10 }}
            >
              {track.name}
            </Text>
            <Text style={{ color: "rgba(255,255,255,0.5)" }}>
              {track.artists[0].name}
            </Text>
          </View>
        </TouchableOpacity>
      </Animated.View>
    );
  }
}

export default RecentlyPlayedItem;
