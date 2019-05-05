import Api from "../api";
import asyncScriptLoader from "async-script-loader";
import store from "../store";

export const handleScriptLoad = () => {
  return new Promise(resolve => {
    if (window.Spotify) {
      resolve();
    } else {
      window.onSpotifyWebPlaybackSDKReady = resolve;
    }
  });
};

export const initPlayer: (
  accessToken: string
) => Promise<Spotify.SpotifyPlayer> = accessToken => {
  return new Promise((resolve, reject) => {
    asyncScriptLoader("https://sdk.scdn.co/spotify-player.js")
      .then(() => {
        const getOauthToken = () => {
          return (cb: (accessToken: string) => void) => {
            cb(accessToken);
          };
        };
        window.onSpotifyWebPlaybackSDKReady = () => {
          const player: Spotify.SpotifyPlayer = new Spotify.Player({
            name: "Web Playback SDK Quick Start Player",
            getOAuthToken: getOauthToken(),
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

          window.player = player;
          resolve(player);
        };
      })
      .catch(console.log);
  });
};
