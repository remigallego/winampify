import loadJs from "loadjs";
import { sdkpath } from "../api/settings";

export const initPlayer: (
  accessToken: string
) => Promise<null> = accessToken => {
  return new Promise((resolve, reject) => {
    window.onSpotifyWebPlaybackSDKReady = () => {
      const logMessage = ({ message }: { message: string }) => {
        // tslint:disable-next-line: no-console
        console.info(message);
      };
      const getOauthToken = () => {
        return (cb: (accessToken: string) => void) => {
          cb(accessToken);
        };
      };
      const player: Spotify.SpotifyPlayer = new Spotify.Player({
        name: "Winampify",
        getOAuthToken: getOauthToken(),
        volume: 0.8
      });

      player.addListener("initialization_error", logMessage);
      player.addListener("authentication_error", logMessage);
      player.addListener("account_error", logMessage);
      player.addListener("playback_error", logMessage);

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
    };
    window.onerror = msg => {
      reject({
        message: msg
      });
    };

    loadJs([sdkpath], "sdk_ready");
    loadJs.ready("sdk_ready", () => {
      resolve();
    });
  });
};

declare global {
  interface Window {
    player: Spotify.SpotifyPlayer;
  }
}
