import SpotifyApiService from "../SpotifyApi/api";
import asyncScriptLoader from "async-script-loader";

export const initPlayer: () => Promise<Spotify.SpotifyPlayer> = () => {
  return new Promise((resolve, reject) => {
    try {
      asyncScriptLoader("https://sdk.scdn.co/spotify-player.js")
        .then(() => {
          window.onSpotifyWebPlaybackSDKReady = () => {
            const player: Spotify.SpotifyPlayer = new Spotify.Player({
              name: "Web Playback SDK Quick Start Player",
              getOAuthToken: SpotifyApiService.getOauthToken(),
              volume: 0.8
            });

            player.addListener(
              "initialization_error",
              ({ message }: { message: string }) => {
                console.error(message);
              }
            );
            player.addListener(
              "authentication_error",
              ({ message }: { message: string }) => {
                console.error(message);
              }
            );
            player.addListener(
              "account_error",
              ({ message }: { message: string }) => {
                console.error(message);
              }
            );
            player.addListener(
              "playback_error",
              ({ message }: { message: string }) => {
                console.error(message);
              }
            );

            // Workaround for Google Chrome >= 74
            // https://github.com/spotify/web-playback-sdk/issues/75
            const iframe = document.querySelector(
              'iframe[src="https://sdk.scdn.co/embedded/index.html"]'
            );

            if (iframe) {
              // @ts-ignore
              iframe.style.display = "block";
              // @ts-ignore
              iframe.style.position = "absolute";
              // @ts-ignore
              iframe.style.top = "-1000px";
              // @ts-ignore
              iframe.style.left = "-1000px";
            }
            resolve(player);
          };
        })
        .catch(console.log);
    } catch (e) {
      console.error(e);
      reject(e);
    }
  });
};
