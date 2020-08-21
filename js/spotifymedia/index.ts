import PQueue from "p-queue";
import Api from "../api";
import Emitter from "./emitter";
import SpotifyMediaLogger from "./logger";
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
  Logger: SpotifyMediaLogger;

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
    this.Logger = new SpotifyMediaLogger();
  }

  init() {
    this.player = window.player;
    this.initEventListeners();
    this.player.connect();
  }

  initEventListeners() {
    /*
      The reason why we're not handling all of this in the class is in case
        Spotify is being controlled from an external source
    */
    this.player.addListener("ready", ({ device_id }) => {
      this.deviceId = device_id;
      this.Logger.ready(device_id);
    });

    this.player.addListener("not_ready", ({ device_id }) =>
      this.Logger.notReady(device_id)
    );

    this.player.addListener(
      "player_state_changed",
      (state: Spotify.PlaybackState) => {
        console.log("Player State Changed = ", state);
        this._timeRemaining = Math.floor(state.duration / 1000);
        this._timeElapsed = Math.floor(state.position / 1000);
        this.emitter.trigger("timeupdate");

        if (isEndOfTrack(state)) {
          if (this.status === STATUS.STOPPED) return;
          this.emitter.trigger("ended");
          this.status = STATUS.STOPPED;
          return;
        }
      }
    );
  }

  stopTimer() {
    clearInterval(this.timeElapsedInterval);
    this.timeElapsedInterval = null;
  }

  resumeTimer() {
    const setElapsedInterval = () => {
      if (this.timeElapsedInterval) {
        return;
      }
      this.timeElapsedInterval = setInterval(() => {
        this._timeElapsed = this._timeElapsed + 1;
        this.emitter.trigger("timeupdate");
      }, 1000);
    };
    setElapsedInterval();
    this.emitter.trigger("playing");
    this.emitter.trigger("timeupdate");
    this.status = STATUS.PLAYING;
  }

  /*
   * *******
   * Below, methods required and called by Webamp
   * *******
   */

  // Getters
  duration = () => this._timeRemaining;
  timeElapsed = () => this._timeElapsed;
  timeRemaining = () => this.duration() - this.timeElapsed();
  percentComplete = () => (this.timeElapsed() / this.duration()) * 100;

  // Actions triggered by Webamp's buttons
  async play() {
    if (this.player) {
      if (this.status === STATUS.PAUSED || this.status === STATUS.STOPPED) {
        await this.player.resume();
        this.resumeTimer();
        this.status = STATUS.PLAYING;
      }
    }
  }

  async pause() {
    if (this.player) {
      if (this.status === STATUS.PLAYING) {
        await this.player.pause();
        this.stopTimer();
        this.status = STATUS.PAUSED;
        return;
      }
      if (this.status === STATUS.PAUSED || this.status === STATUS.STOPPED) {
        await this.player.resume();
        this.resumeTimer();
        this.status = STATUS.PLAYING;
        return;
      }
    }
  }

  async stop() {
    await this.player.pause();
    this.stopTimer();
    this.status = STATUS.STOPPED;

    setTimeout(() => {
      this._timeElapsed = Math.floor(0);
      this.seekToPercentComplete(0);
    }, 200);
  }

  async seekToPercentComplete(percent: number) {
    const seekTime = this.duration() * (percent / 100);
    await this.player.seek(seekTime * 1000);
  }

  setVolume(volume: number) {
    if (this.player) this.player.setVolume(volume / 100);
  }
  async loadFromUrl(url: string) {
    console.log("loadFromUrl === ", url);
    this._timeElapsed = Math.floor(0);
    await this.queue.add(async () => {
      const res = await Api.put(`me/player/play?device_id=${this.deviceId}`, {
        body: JSON.stringify({
          uris: [`spotify:track:${url}`]
        })
      });
      if (res.ok && res.status === 204) {
        this.resumeTimer();
      }
    });
  }

  // Listeners
  on(event: string, callback: (...args: any[]) => void) {
    this.emitter.on(event, callback);
  }
  /* All of these don't work with Spotify  */
  getAnalyser = () => this.analyser;
  setPreamp = (value: number) => {};
  setBalance = (balance: number) => {};
  setEqBand = (band: any, value: number) => {};
  disableEq = () => {};
  enableEq = () => {};
  seekToTime = (time: number) => {};
  dispose = () => {};
}
