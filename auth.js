import { AuthSession } from "expo";
import axios from "axios";
import { encode as btoa } from "base-64";
import SpotifyWebAPI from "spotify-web-api-js";

import credentials from "./credentials";
import { setUserData, getUserData } from "./storage";

const scopes = [
  "user-modify-playback-state",
  "user-read-currently-playing",
  "user-read-playback-state",
  "user-library-modify",
  "user-library-read",
  "playlist-read-private",
  "playlist-read-collaborative",
  "playlist-modify-public",
  "playlist-modify-private",
  "user-read-recently-played",
  "user-top-read"
];

const getAuthorizationCode = async () => {
  try {
    const redirectUrl = AuthSession.getRedirectUrl();
    const result = await AuthSession.startAsync({
      authUrl:
        "https://accounts.spotify.com/authorize" +
        "?response_type=code" +
        "&client_id=" +
        credentials.clientId +
        (scopes ? "&scope=" + encodeURIComponent(scopes) : "") +
        "&redirect_uri=" +
        encodeURIComponent(redirectUrl)
    });
    return result.params.code;
  } catch (err) {
    console.log("[ERROR] Auth:getAuthorizationCode", err);
  }
};

const getTokens = async () => {
  try {
    const { clientId, clientSecret, redirectUri } = credentials;
    const authorizationCode = await getAuthorizationCode();
    const credsB64 = btoa(`${clientId}:${clientSecret}`);
    const response = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: {
        Authorization: `Basic ${credsB64}`,
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: `grant_type=authorization_code&code=${authorizationCode}&redirect_uri=${redirectUri}`
    });
    const data = await response.json();
    const {
      access_token: accessToken,
      refresh_token: refreshToken,
      expires_in: expiresIn
    } = data;
    const expirationTime = new Date().getTime() + expiresIn * 1000;
    await setUserData("accessToken", accessToken);
    await setUserData("refreshToken", refreshToken);
    await setUserData("expirationTime", expirationTime);
  } catch (err) {
    console.log("[ERROR] Auth:getTokens", err);
  }
};

export const refreshTokens = async () => {
  try {
    const { clientId, clientSecret } = credentials;
    const credsB64 = btoa(`${clientId}:${clientSecret}`);
    const refreshToken = await getUserData("refreshToken");
    const response = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: {
        Authorization: `Basic ${credsB64}`,
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: `grant_type=refresh_token&refresh_token=${refreshToken}`
    });
    const data = await response.json();
    if (data.error) {
      await getTokens();
    } else {
      const {
        access_token: newAccessToken,
        refresh_token: newRefreshToken,
        expires_in: expiresIn
      } = data;

      const expirationTime = new Date().getTime() + expiresIn * 1000;
      await setUserData("accessToken", newAccessToken);
      if (newRefreshToken) {
        await setUserData("refreshToken", newRefreshToken);
      }
      await setUserData("expirationTime", expirationTime);
    }
  } catch (err) {
    cconsole.log("[ERROR] Auth:refreshTokens", err);
  }
};

export const getValidSPObj = async () => {
  const tokenExpirationTime = await getUserData("expirationTime");
  if (new Date().getTime() > +tokenExpirationTime) {
    // access token has expired, so we need to use the refresh token
    await refreshTokens();
  }
  const accessToken = await getUserData("accessToken");
  var sp = new SpotifyWebAPI();
  await sp.setAccessToken(accessToken);
  return sp;
};
