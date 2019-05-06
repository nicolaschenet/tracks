import React from "react";
import {
  Animated,
  ImageBackground,
  FlatList,
  Image,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Easing
} from "react-native";
import { BlurView } from "expo";
import GestureRecognizer from "react-native-swipe-gestures";
import { EvilIcons } from "@expo/vector-icons";

import axios from "axios";

import { timer, from, defer, forkJoin } from "rxjs";
import { map, switchMap } from "rxjs/operators";

import Loading from "./components/Loading";
import NoActivePlayer from "./components/NoActivePlayer";
import RecentlyPlayedItem from "./components/RecentlyPlayedItem";
import RecentlyPlayedItemSeparator from "./components/RecentlyPlayedItemSeparator";
import Cover from "./components/Cover";
import TrackInfo from "./components/TrackInfo";
import TrackProgress from "./components/TrackProgress";
import TrackControls from "./components/TrackControls";
import RecentlyPlayedItems from "./components/RecentlyPlayedItems";

import {
  play,
  getUserPlayingTrack,
  getMyRecentlyPlayedTracks,
  pause,
  skipToNext,
  skipToPrevious
  // getPalette
} from "./api";

export default class App extends React.Component {
  state = {
    loading: true,
    playing: false,
    communicating: false,
    communicationEnded: false,
    currentTrack: null,
    previousTrack: null,
    history: null,
    historyPanelTop: new Animated.Value(1000),
    containerPadding: new Animated.Value(0),
    // palette: {},
    // backgroundColor: new Animated.Value(0),
    previousBackgroundColor: "#000",
    targetBackgroundColor: "#000"
  };

  openPanel = () => {
    Animated.timing(this.state.historyPanelTop, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true
    }).start();
  };

  closePanel = () => {
    Animated.timing(this.state.historyPanelTop, {
      toValue: 1000,
      duration: 300,
      useNativeDriver: true
    }).start();
  };

  trackHasChanged = id => {
    const { currentTrack } = this.state;
    return currentTrack ? currentTrack.item.id !== id : false;
  };

  playingStatusHasChanged = status => {
    const { playing } = this.state;
    return playing !== status;
  };

  updateState$ = () => {
    timer(0, 1000)
      .pipe(switchMap(_ => defer(getUserPlayingTrack)))
      .subscribe(async currentTrack => {
        if (!currentTrack || currentTrack === "") {
          return this.setState({ currentTrack: null, loading: false });
        }
        try {
          defer(getMyRecentlyPlayedTracks).subscribe(({ items }) => {
            // forkJoin([
            //   defer(getMyRecentlyPlayedTracks),
            //   from(getPalette(currentTrack.item.album.images[0].url))
            // ]).subscribe(([{ items }, { data: { palette } }]) => {
            if (
              this.state.communicationEnded &&
              (this.trackHasChanged(currentTrack.item.id) ||
                this.playingStatusHasChanged(currentTrack.is_playing))
            ) {
              this.setState({
                communicating: false,
                communicationEnded: false
              });
            }
            this.setState(
              {
                // backgroundColor: new Animated.Value(0),
                // palette,
                // previousBackgroundColor: this.state.targetBackgroundColor,
                // targetBackgroundColor: palette.backgroundColor,
                loading: false,
                currentTrack,
                previousTrack: this.state.currentTrack,
                history: items,
                playing: !!currentTrack.is_playing
              },
              () => {
                // Animated.timing(this.state.backgroundColor, {
                //   toValue: 100,
                //   duration: 800
                // }).start();
              }
            );
          });
        } catch (err) {
          this.setState({ loading: false });
        }
      });
  };

  updateState = async () => {
    this.interval = setInterval(async () => {
      try {
        const currentTrack = await getUserPlayingTrack();
        if (!currentTrack) {
          return this.setState({ loading: false });
        }
        const { items } = await getMyRecentlyPlayedTracks();
        // const {
        //   data: { palette }
        // } = await axios.get(
        //   `https://color-api.nicolaschenet.now.sh/palette/${encodeURIComponent(
        //     currentTrack.item.album.images[0].url
        //   )}`
        // );
        if (
          this.state.communicationEnded &&
          (this.trackHasChanged(currentTrack.item.id) ||
            this.playingStatusHasChanged(currentTrack.is_playing))
        ) {
          this.setState({
            communicating: false,
            communicationEnded: false
          });
        }
        this.setState(
          {
            // backgroundColor: new Animated.Value(0),
            // palette,
            // previousBackgroundColor: this.state.targetBackgroundColor,
            // targetBackgroundColor: palette.backgroundColor,
            loading: false,
            currentTrack,
            previousTrack: this.state.currentTrack,
            history: items,
            playing: !!currentTrack.is_playing
          },
          () => {
            // Animated.timing(this.state.backgroundColor, {
            //   toValue: 100,
            //   duration: 800
            // }).start();
          }
        );
      } catch (err) {
        console.log(JSON.stringify(err));
      }
    }, 1000);
  };

  componentDidMount() {
    Animated.timing(this.state.containerPadding, {
      toValue: 50,
      duration: 1200,
      easing: Easing.elastic()
    }).start();
    this.updateState$();
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  playTrack = uri => play({ uris: [uri] });

  handleSPControl = controlFn => async () => {
    const { communicating } = this.state;
    if (communicating) {
      return;
    }
    this.setState({ communicating: true });
    await controlFn();
    this.setState({ communicationEnded: true });
  };

  handlePressTrack = uri => () => {
    this.playTrack(uri);
    this.closePanel();
  };

  render() {
    const {
      // backgroundColor,
      containerPadding,
      // previousBackgroundColor,
      // targetBackgroundColor,
      currentTrack,
      history,
      loading,
      playing,
      historyPanelTop,
      // palette,
      communicating
    } = this.state;
    if (loading) {
      return <Loading />;
    }
    if (currentTrack) {
      return (
        <View style={{ flex: 1, position: "relative" }}>
          <ImageBackground
            source={{ uri: currentTrack.item.album.images[0].url }}
            resizeMode="cover"
            style={{ width: "100%", height: "100%" }}
          >
            <BlurView
              tint="dark"
              intensity={100}
              style={StyleSheet.absoluteFill}
            >
              <GestureRecognizer
                style={{ flex: 1, position: "relative" }}
                config={{
                  velocityThreshold: 0.3,
                  directionalOffsetThreshold: 80
                }}
                onSwipeUp={this.openPanel}
              >
                <StatusBar barStyle="light-content" />
                <Animated.View
                  style={{
                    flex: 1,
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: containerPadding,
                    zIndex: 1
                    // backgroundColor: backgroundColor.interpolate({
                    //   inputRange: [0, 100],
                    //   outputRange: [
                    //     previousBackgroundColor,
                    //     targetBackgroundColor
                    //   ]
                    // })
                  }}
                >
                  <Cover track={currentTrack} />
                  <View
                    style={{
                      flex: 3,
                      justifyContent: "center",
                      alignItems: "center",
                      paddingTop: 20
                    }}
                  >
                    <TrackInfo track={currentTrack} />
                    <TrackProgress track={currentTrack} />
                    <TrackControls
                      communicating={communicating}
                      playing={playing}
                      handlePlay={this.handleSPControl(play)}
                      handlePause={this.handleSPControl(pause)}
                      handleSkipToPrevious={this.handleSPControl(
                        skipToPrevious
                      )}
                      handleSkipToNext={this.handleSPControl(skipToNext)}
                    />
                  </View>
                </Animated.View>
              </GestureRecognizer>
            </BlurView>
          </ImageBackground>
          <RecentlyPlayedItems
            historyPanelTop={historyPanelTop}
            data={history}
            handleClosePanel={this.closePanel}
            handlePressTrack={this.handlePressTrack}
          />
        </View>
      );
    }
    return <NoActivePlayer />;
  }
}
