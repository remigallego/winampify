import Emitter from "./emitter";
import SpotifyApiService from "../SpotifyApi/api";
import PQueue from "p-queue";
import {
  endOfTrack,
  beginningOfTrack,
  pauseTrack,
  resumeTrack,
  seekTrack
} from "./utils";
import { initPlayer } from "./initPlayer";

export enum STATUS {
  PLAYING,
  PAUSED,
  STOPPED
}

export default class SpotifyMediaClass {
  _analyser: AnalyserNode;
  _context: AudioContext;
  _emitter: Emitter;

  _queue: PQueue;

  _device_id: string;
  _timeElapsed: number;
  _timeRemaining: number;
  _timeElapsedInterval: any;
  _status: STATUS;
  _player!: Spotify.SpotifyPlayer;
  truc!: Spotify.AddListenerFn;

  constructor() {
    // @ts-ignore Typescript does not know about webkitAudioContext
    this._context = new (window.AudioContext || window.webkitAudioContext)();
    this._analyser = this._context.createAnalyser();
    this._analyser.fftSize = 2048;
    this._analyser.smoothingTimeConstant = 0.0;
    this._emitter = new Emitter();

    this._status = STATUS.STOPPED;

    this._device_id = "";
    this._timeElapsed = 0;
    this._timeRemaining = 0;
    this._timeElapsedInterval = null;

    this._queue = new PQueue();

    this.init();

    this.loadFromUrl = this.loadFromUrl.bind(this);
  }

  async init() {
    initPlayer().then(player => {
      this._player = player;
      this._player.addListener(
        "ready",
        ({ device_id }: { device_id: string }) => {
          this._device_id = device_id;
          console.log("Ready with Device ID", device_id);
        }
      );

      this._player.addListener(
        "not_ready",
        ({ device_id }: { device_id: string }) => {
          console.log("Device ID has gone offline", device_id);
        }
      );

      /* 
      The reason why we're not handling all of this in the class is in case 
        Spotify is being controlled from an external source 
      */
      this._player.addListener(
        "player_state_changed",
        (state: Spotify.PlaybackState) => {
          console.log("player state changed: ", state);
          if (beginningOfTrack(state)) {
            console.log(
              "%cbeginningOfTrack",
              "background: #222; color: #bada55"
            );
            this._timeRemaining = Math.floor(state.duration / 1000);
            clearInterval(this._timeElapsedInterval);
            this._timeElapsedInterval = null;
            this._timeElapsed = Math.floor(0);
            this.setElapsedInterval();
            this._emitter.trigger("playing");
            this._emitter.trigger("timeupdate");
            this._status = STATUS.PLAYING;
            return;
          }

          if (pauseTrack(state)) {
            console.log("%cpauseTrack", "background: #222; color: #bada55");
            clearInterval(this._timeElapsedInterval);
            this._timeElapsedInterval = null;
            this._timeElapsed = Math.floor(state.position / 1000);
            this._emitter.trigger("timeupdate");
            this._status = STATUS.PAUSED;
            return;
          }

          if (resumeTrack(state, this._timeElapsed * 1000, this._status)) {
            console.log("%cresumeTrack", "background: #222; color: #bada55");
            clearInterval(this._timeElapsedInterval);
            this._timeElapsedInterval = null;
            this._timeElapsed = Math.floor(state.position / 1000);
            this._emitter.trigger("timeupdate");
            this.setElapsedInterval();
            this._status = STATUS.PLAYING;
            return;
          }

          if (endOfTrack(state)) {
            console.log("%cend of track", "background: #222; color: #bada55");
            if (this._status === STATUS.STOPPED) return;
            this._emitter.trigger("ended");
            this._status = STATUS.STOPPED;
            return;
          }

          // If all else fails, just update the position
          console.log(
            "%cupdate the position ",
            "background: #222; color: #bada55"
          );
          clearInterval(this._timeElapsedInterval);
          this._timeElapsedInterval = null;
          this._timeElapsed = Math.floor(state.position / 1000);
          this._emitter.trigger("timeupdate");
          this.setElapsedInterval();
          this._status = STATUS.PLAYING;
        }
      );
      player.connect();
    });
  }

  setElapsedInterval() {
    this._timeElapsedInterval = setInterval(() => {
      this._timeElapsed = this._timeElapsed + 1;
      this._emitter.trigger("timeupdate");
    }, 1000);
  }

  /* Properties */
  duration() {
    return this._timeRemaining;
  }

  timeElapsed() {
    return this._timeElapsed;
    /*   return this._source.getTimeElapsed(); */
  }

  timeRemaining() {
    return this.duration() - this.timeElapsed();
  }

  percentComplete() {
    return (this.timeElapsed() / this.duration()) * 100;
  }

  /* Actions */
  async play() {
    this._player.resume().then(() => {});
  }

  pause() {
    this._player.pause().then(() => {});
  }

  stop() {
    this.pause();
    this.seekToPercentComplete(0);
  }

  /* Actions with arguments */
  seekToPercentComplete(percent: number) {
    const seekTime = this.duration() * (percent / 100);
    this._player.seek(seekTime * 1000).then(() => {});
  }

  // From 0-1
  setVolume(volume: number) {
    // Doesn't work when player not init already, find a better solution
    if (this._player)
      this._player.setVolume(volume / 100).then(() => {
        console.log("Volume updated!");
      });
  }

  async loadFromUrl(url: string) {
    this._queue.add(async () =>
      SpotifyApiService.put(`me/player/play?device_id=${this._device_id}`, {
        body: JSON.stringify({
          uris: [`spotify:track:${url}`]
        })
      }).then(res => {
        if (res.status === 204) Promise.resolve();
      })
    );
  }

  /* Listeners */
  on(event: string, callback: (...args: any[]) => void) {
    this._emitter.on(event, callback);
  }

  /* All of these don't work with Spotify but are needed by Webamp */

  getAnalyser() {
    return this._analyser;
  }
  setPreamp(value: number) {}

  setBalance(balance: number) {}

  setEqBand(band: any, value: number) {}

  disableEq() {}

  enableEq() {}

  seekToTime(time: number) {}

  dispose() {}
}
