import React from "react";
import { Animated, FlatList, TouchableOpacity, View, Text } from "react-native";
import { EvilIcons } from "@expo/vector-icons";

import RecentlyPlayedItemSeparator from "./RecentlyPlayedItemSeparator";
import RecentlyPlayedItem from "./RecentlyPlayedItem";

const RecentlyPlayedItems = ({
  historyPanelTop,
  data,
  handleClosePanel,
  handlePressTrack
}) => (
  <Animated.View
    style={{
      position: "absolute",
      width: "100%",
      backgroundColor: "#000",
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
      transform: [{ translateY: historyPanelTop }],
      zIndex: 2,
      paddingTop: 40
    }}
  >
    <FlatList
      stickyHeaderIndices={[0]}
      data={data}
      ItemSeparatorComponent={RecentlyPlayedItemSeparator}
      ListHeaderComponent={() => (
        <TouchableOpacity onPress={handleClosePanel}>
          <View
            style={{
              backgroundColor: "#000",
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              padding: 20
            }}
          >
            <Text style={{ color: "#fff", fontSize: 20 }}>Recently played</Text>
            <EvilIcons name="chevron-down" size={42} color="#fff" />
          </View>
        </TouchableOpacity>
      )}
      renderItem={({ item }) => (
        <RecentlyPlayedItem
          item={item}
          onPress={handlePressTrack(item.track.uri)}
        />
      )}
      keyExtractor={(item, index) => "" + index}
    />
  </Animated.View>
);

export default RecentlyPlayedItems;
