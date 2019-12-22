import PQueue from "p-queue";
import Api from "../api";
import Emitter from "./emitter";
import {
  isBeginningOfTrack,
  isEndOfTrack,
  isPauseTrack,
  isResumeTrack
} from "./utils";

export enum STATUS {
  PLAYING,
  PAUSED,
  STOPPED
}

export default class SpotifyMedia {
  analyser: AnalyserNode;
  context: AudioContext;
  emitter: Emitter;

  queue: PQueue;

  deviceId: string;
  // tslint:disable-next-line: variable-name
  _timeElapsed: number;
  // tslint:disable-next-line: variable-name
  _timeRemaining: number;
  timeElapsedInterval: any;
  status: STATUS;
  player!: Spotify.SpotifyPlayer;

  constructor() {
    this.init();

    // @ts-ignore Typescript does not know about webkitAudioContext
    this.context = new (window.AudioContext || window.webkitAudioContext)();
    this.analyser = this.context.createAnalyser();
    this.analyser.fftSize = 2048;
    this.analyser.smoothingTimeConstant = 0.0;
    this.emitter = new Emitter();

    this.status = STATUS.STOPPED;

    this.deviceId = "";
    this._timeElapsed = 0;
    this._timeRemaining = 0;
    this.timeElapsedInterval = null;

    this.queue = new PQueue();

    this.loadFromUrl = this.loadFromUrl.bind(this);
  }

  init() {
    this.player = window.player;
    this.player.addListener("ready", ({ device_id }: { device_id: string }) => {
      this.deviceId = device_id;
      // tslint:disable-next-line: no-console
      console.log("Ready with Device ID", device_id);
    });

    this.player.addListener(
      "not_ready",
      ({ device_id }: { device_id: string }) => {
        // tslint:disable-next-line: no-console
        console.log("Device ID has gone offline", device_id);
      }
    );

    /*
      The reason why we're not handling all of this in the class is in case
        Spotify is being controlled from an external source
      */
    this.player.addListener(
      "player_state_changed",
      (state: Spotify.PlaybackState) => {
        if (isBeginningOfTrack(state)) {
          this._timeRemaining = Math.floor(state.duration / 1000);
          clearInterval(this.timeElapsedInterval);
          this.timeElapsedInterval = null;
          this._timeElapsed = Math.floor(0);
          this.setElapsedInterval();
          this.emitter.trigger("playing");
          this.emitter.trigger("timeupdate");
          this.status = STATUS.PLAYING;
          return;
        }

        if (isPauseTrack(state)) {
          clearInterval(this.timeElapsedInterval);
          this.timeElapsedInterval = null;
          this._timeElapsed = Math.floor(state.position / 1000);
          this.emitter.trigger("timeupdate");
          this.status = STATUS.PAUSED;
          return;
        }

        if (isResumeTrack(state, this._timeElapsed * 1000, this.status)) {
          clearInterval(this.timeElapsedInterval);
          this.timeElapsedInterval = null;
          this._timeElapsed = Math.floor(state.position / 1000);
          this.emitter.trigger("timeupdate");
          this.setElapsedInterval();
          this.status = STATUS.PLAYING;
          return;
        }

        if (isEndOfTrack(state)) {
          if (this.status === STATUS.STOPPED) return;
          this.emitter.trigger("ended");
          this.status = STATUS.STOPPED;
          return;
        }

        // If all else fails, just update the position
        clearInterval(this.timeElapsedInterval);
        this.timeElapsedInterval = null;
        this._timeElapsed = Math.floor(state.position / 1000);
        this.emitter.trigger("timeupdate");
        this.setElapsedInterval();
        this.status = STATUS.PLAYING;
      }
    );
    this.player.connect();
  }

  setElapsedInterval() {
    this.timeElapsedInterval = setInterval(() => {
      this._timeElapsed = this._timeElapsed + 1;
      this.emitter.trigger("timeupdate");
    }, 1000);
  }

  /* Properties */
  duration() {
    return this._timeRemaining;
  }

  timeElapsed() {
    return this._timeElapsed;
  }

  timeRemaining() {
    return this.duration() - this.timeElapsed();
  }

  percentComplete() {
    return (this.timeElapsed() / this.duration()) * 100;
  }

  /* Actions */
  async play() {
    if (this.player) this.player.resume();
  }

  pause() {
    if (this.player) this.player.pause();
  }

  stop() {
    this.player.pause().then(val => {
      setTimeout(() => this.seekToPercentComplete(0), 200);
    });
  }

  /* Actions with arguments */
  seekToPercentComplete(percent: number) {
    const seekTime = this.duration() * (percent / 100);
    this.player.seek(seekTime * 1000);
  }

  // From 0-1
  setVolume(volume: number) {
    // Doesn't work when player not init already, find a better solution
    if (this.player) this.player.setVolume(volume / 100);
  }

  async loadFromUrl(url: string) {
    this.queue.add(async () =>
      Api.put(`me/player/play?device_id=${this.deviceId}`, {
        body: JSON.stringify({
          uris: [`spotify:track:${url}`]
        })
      })
    );
  }

  /* Listeners */
  on(event: string, callback: (...args: any[]) => void) {
    this.emitter.on(event, callback);
  }

  /* All of these don't work with Spotify but are needed by Webamp */

  getAnalyser() {
    return this.analyser;
  }

  setPreamp(value: number) {
    return;
  }

  setBalance(balance: number) {
    return;
  }

  setEqBand(band: any, value: number) {
    return;
  }

  disableEq() {
    return;
  }

  enableEq() {
    return;
  }

  seekToTime(time: number) {
    return;
  }

  dispose() {
    return;
  }
}
