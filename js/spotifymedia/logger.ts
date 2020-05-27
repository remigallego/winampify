import { getArtistName, getTrackName, getTrackDuration } from "./utils";

export default class SpotifyMediaLogger {
  private customConsole = (str: string) =>
    console.log(
      `%c${str}`,
      "background: #222; color: #bada55; font-size: 14px;"
    );

  ready = (id: string) => this.customConsole(`Ready with Device ID ${id}`);
  notReady = (id: string) =>
    this.customConsole(`Device ID has gone offline ${id}`);

  getTrackDetails = (state: Spotify.PlaybackState) =>
    `${getArtistName(state)} - ${getTrackName(
      state
    )}\nDuration: ${getTrackDuration(state)}`;

  play = (state: Spotify.PlaybackState) =>
    this.customConsole(`► Playing: ${this.getTrackDetails(state)}}`);
  pause = (state: Spotify.PlaybackState) =>
    this.customConsole(`▌▌ Pause: ${this.getTrackDetails(state)}`);
  resume = (state: Spotify.PlaybackState) =>
    this.customConsole(`► ▌▌ Resume: ${this.getTrackDetails(state)}`);
  stop = (state: Spotify.PlaybackState) =>
    this.customConsole(`■ Stop: ${this.getTrackDetails(state)}`);
}
