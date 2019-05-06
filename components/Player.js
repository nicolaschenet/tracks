import React, { PureComponent } from "react";

import { Image, Text, TouchableOpacity, View } from "react-native";
import ProgressBarAnimated from "react-native-progress-bar-animated";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import moment from "moment";

import Loading from "./Loading";
import NoActivePlayer from "./NoActivePlayer";

import {
  play,
  getUserPlayingTrack,
  getMyRecentlyPlayedTracks,
  pause,
  skipToNext,
  skipToPrevious
} from "./../api";

class Player extends PureComponent {
  state = {
    loading: true,
    playing: false,
    current: null,
    history: null
  };

  updateState = async () => {
    this.interval = setInterval(async () => {
      const current = await getUserPlayingTrack();
      const history = await getMyRecentlyPlayedTracks();
      this.setState(
        {
          loading: false,
          current,
          history,
          playing: !!current.is_playing
        },
        () => {
          console.log("Updating state", this.state.playing);
          if (!this.state.playing) {
            clearInterval(this.interval);
          }
        }
      );
    }, 1000);
  };

  componentDidMount() {
    this.updateState();
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  pause = () => {
    this.setState({ playing: false }, () => {
      pause();
      clearInterval(this.interval);
    });
  };

  play = () => {
    this.setState({ playing: true }, () => {
      play();
      this.updateState();
    });
  };

  render() {
    const { current, history, loading, playing } = this.state;
    if (loading) {
      return <Loading />;
    }
    if (current) {
      return (
        <View
          style={{
            flex: 1,
            backgroundColor: "#000",
            alignItems: "center",
            justifyContent: "space-between",
            padding: 50,
            zIndex: 1
          }}
        >
          <View
            style={{
              flex: 3,
              justifyContent: "center",
              shadowColor: "#bbb",
              shadowOffset: { width: 0, height: 0 },
              shadowOpacity: 1,
              shadowRadius: 150
            }}
          >
            <Image
              source={{ uri: current.item.album.images[0].url }}
              style={{
                width: 320,
                height: 320
              }}
            />
            <ProgressBarAnimated
              height={5}
              borderRadius={0}
              borderWidth={0}
              width={320}
              value={(current.progress_ms / current.item.duration_ms) * 100}
            />
          </View>
          <View>
            <ImagePalette image={current.item.images[0].url}>
              {({ backgroundColor, color, alternativeColor }) => {
                <Text style={{ color: "#fff" }}>color: {color}</Text>;
              }}
            </ImagePalette>
          </View>
          <View
            style={{
              flex: 2,
              justifyContent: "center",
              alignItems: "center"
            }}
          >
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
                  textAlign: "center",
                  marginBottom: 5
                }}
              >
                {current.item.name}
              </Text>
              <Text style={{ color: "#999", marginBottom: 30 }}>
                {current.item.artists[0].name}
              </Text>
              <Text style={{ color: "#666", fontSize: 14, marginBottom: 30 }}>
                {moment.utc(current.progress_ms).format(" m:ss ")}/
                {moment.utc(current.item.duration_ms).format(" m:ss ")}
              </Text>
            </View>
            <View
              style={{
                flex: 1,
                width: 300,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-around"
              }}
            >
              <TouchableOpacity onPress={skipToPrevious}>
                <MaterialCommunityIcons
                  name="skip-previous"
                  size={40}
                  color="#555"
                />
              </TouchableOpacity>
              {current.is_playing && (
                <TouchableOpacity onPress={this.pause}>
                  <MaterialCommunityIcons
                    name="pause-circle"
                    size={80}
                    color="#fff"
                  />
                </TouchableOpacity>
              )}
              {!current.is_playing && (
                <TouchableOpacity onPress={this.play}>
                  <MaterialCommunityIcons
                    name="play-circle"
                    size={80}
                    color="#fff"
                  />
                </TouchableOpacity>
              )}
              <TouchableOpacity onPress={skipToNext}>
                <MaterialCommunityIcons
                  name="skip-next"
                  size={40}
                  color="#555"
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      );
    }
    return <NoActivePlayer />;
  }
}

export default Player;
