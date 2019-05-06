import { getValidSPObj } from "./auth";
import axios from "axios";

export const getUserPlaylists = async () => {
  const sp = await getValidSPObj();
  const { id: userId } = await sp.getMe();
  const { items: playlists } = await sp.getUserPlaylists(userId, { limit: 50 });
  return playlists;
};

export const getUserTracks = async (options = { limit: 50 }) => {
  const sp = await getValidSPObj();
  const { items: tracks } = await sp.getMySavedTracks(options);
  return tracks;
};

export const getUserPlayingTrack = async () => {
  const sp = await getValidSPObj();
  const playing = await sp.getMyCurrentPlayingTrack();
  return playing;
};

export const play = async options => {
  const sp = await getValidSPObj();
  return sp.play(options);
};

export const pause = async () => {
  const sp = await getValidSPObj();
  return sp.pause();
};

export const skipToNext = async () => {
  const sp = await getValidSPObj();
  return sp.skipToNext();
};

export const skipToPrevious = async () => {
  const sp = await getValidSPObj();
  return sp.skipToPrevious();
};

export const getMyRecentlyPlayedTracks = async () => {
  const sp = await getValidSPObj();
  const tracks = await sp.getMyRecentlyPlayedTracks();
  return tracks;
};

export const getPalette = imageUrl =>
  axios.get(
    `https://color-api.nicolaschenet.now.sh/palette/${encodeURIComponent(
      imageUrl
    )}`
  );
