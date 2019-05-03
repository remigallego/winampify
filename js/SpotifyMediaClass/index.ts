import Emitter from "./emitter";
import SpotifyApiService from "../SpotifyApi/api";
import { stat } from "fs";
interface WebPlaybackTrack {
  uri: string; // Spotify URI
  id: string; // Spotify ID from URI (can be null)
  type: string; // Content type: can be "track", "episode" or "ad"
  media_type: string; // Type of file: can be "audio" or "video"
  name: string; // Name of content
  is_playable: boolean; // Flag indicating whether it can be played
  album: {
    uri: string; // Spotify Album URI
    name: string;
    images: [{ url: string }];
  };
  artists: [{ uri: string; name: string }];
}

interface WebPlaybackState {
  context: {
    uri: string; // The URI of the context (can be null)
    metadata: any | null; // Additional metadata for the context (can be null)
  };
  disallows: {
    // A simplified set of restriction controls for
    pausing: boolean; // The current track. By default; these fields
    peeking_next: boolean; // will either be set to false or undefined; which
    peeking_prev: boolean; // indicates that the particular operation is
    resuming: boolean; // allowed. When the field is set to `true`; this
    seeking: boolean; // means that the operation is not permitted. For
    skipping_next: boolean; // example; `skipping_next`; `skipping_prev` and
    skipping_prev: boolean; // `seeking` will be set to `true` when playing an
    // ad track.
  };
  duration: number;
  paused: boolean; // Whether the current track is paused.
  position: number; // The position_ms of the current track.
  repeat_mode: number; // The repeat mode. No repeat mode is 0;
  // once-repeat is 1 and full repeat is 2.
  shuffle: boolean; // True if shuffled; false otherwise.
  track_window: {
    current_track: WebPlaybackTrack; // The track currently on local playback
    previous_tracks: WebPlaybackTrack[]; // Previously played tracks. Number can vary.
    next_tracks: WebPlaybackTrack[]; // Tracks queued next. Number can vary.
  };
}

export default class SpotifyMediaClass {
  _analyser: AnalyserNode;
  _context: AudioContext;
  device_id: string;
  _emitter: Emitter;

  player: Spotify.SpotifyPlayer;
  _timeElapsed: number;
  _timeRemaining: number;
  _timeInterval: any;
  /* _emitter: Emitter;
  _context: AudioContext;
  _balance: StereoBalanceNodeType;
  _staticSource: GainNode;
  _preamp: GainNode;
  _analyser: AnalyserNode;
  _gainNode: GainNode;
  _source: ElementSource;
  _bands: { [band: number]: BiquadFilterNode }; */

  constructor() {
    // @ts-ignore Typescript does not know about webkitAudioContext
    this._context = new (window.AudioContext || window.webkitAudioContext)();
    this._analyser = this._context.createAnalyser();
    this._analyser.fftSize = 2048;
    // don't smooth audio analysis
    this._analyser.smoothingTimeConstant = 0.0;

    this.device_id = "";
    this._emitter = new Emitter();
    this.player = null;
    this._timeElapsed = 0;
    this._timeRemaining = 0;
    this._timeInterval = null;

    const existingScript = document.getElementById("scriptId");
    if (!existingScript) {
      const script = document.createElement("script");
      script.src = "https://sdk.scdn.co/spotify-player.js";
      script.id = "spotify sdk";
      document.body.appendChild(script);

      script.onload = () => {
        window.onSpotifyWebPlaybackSDKReady = () => {
          const player: Spotify.SpotifyPlayer = new Spotify.Player({
            name: "Web Playback SDK Quick Start Player",
            getOAuthToken: SpotifyApiService.getOauthToken()
            // volume
          });

          this.player = player;

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

          // Error handling
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

          // Playback status updates
          player.addListener(
            "player_state_changed",
            (state: WebPlaybackState) => {
              console.log("player_state_changed");
              console.log(state);

              if (
                state.paused &&
                state.position === 0 &&
                state.restrictions.disallow_resuming_reasons &&
                state.restrictions.disallow_resuming_reasons[0] === "not_paused"
              ) {
                console.log("finished");
                this._emitter.trigger("ended");
              }

              if (!state.position && !state.paused) {
                clearInterval(this._timeInterval);
                this._timeInterval = null;
                this._timeInterval = setInterval(() => {
                  this._timeElapsed = this._timeElapsed + 1;
                  this._emitter.trigger("timeupdate");
                }, 1000);
                this._emitter.trigger("playing");
                this._timeElapsed = Math.floor(state.position / 1000);
                this._timeRemaining = Math.floor(state.duration / 1000);
                this._emitter.trigger("timeupdate");
                return;
              }

              if (state.position && !state.paused) {
                clearInterval(this._timeInterval);
                this._timeElapsed = Math.floor(state.position / 1000);
                this._timeInterval = null;
                this._emitter.trigger("timeupdate");
                this._timeInterval = setInterval(() => {
                  this._timeElapsed = this._timeElapsed + 1;
                  this._emitter.trigger("timeupdate");
                }, 1000);
              }
              // Pause while playing
              if (state.position && state.paused) {
                clearInterval(this._timeInterval);
                this._timeInterval = null;
                this._emitter.trigger("timeupdate");
                return;
              }

              if (!state.paused) {
                if (!this._timeInterval) {
                  this._timeInterval = setInterval(() => {
                    this._timeElapsed = this._timeElapsed + 1;
                    this._emitter.trigger("timeupdate");
                  }, 1000);
                  this._emitter.trigger("playing");
                }
                return;
              }

              this._timeElapsed = Math.floor(state.position / 1000);
              this._timeRemaining = Math.floor(state.duration / 1000);
              this._emitter.trigger("timeupdate");
            }
          );

          // Ready
          player.addListener(
            "ready",
            ({ device_id }: { device_id: string }) => {
              this.device_id = device_id;
              console.log("Ready with Device ID", device_id);
            }
          );

          // Not Ready
          player.addListener(
            "not_ready",
            ({ device_id }: { device_id: string }) => {
              console.log("Device ID has gone offline", device_id);
            }
          );

          // Connect to the player!
          player.connect();
        };
      };
    }

    //this._emitter = new Emitter();
    // @ts-ignore Typescript does not know about webkitAudioContext
    //this._context = new (window.AudioContext || window.webkitAudioContext)();
    // Fix for iOS and Chrome (Canary) which require that the context be created
    // or resumed by a user interaction.
    // https://developers.google.com/web/updates/2017/09/autoplay-policy-changes
    // https://gist.github.com/laziel/7aefabe99ee57b16081c
    // Via: https://stackoverflow.com/a/43395068/1263117
    // TODO #leak
    /* if (this._context.state === "suspended") {
      const resume = async () => {
        await this._context.resume();

        if (this._context.state === "running") {
          // TODO: Add this to the disposable
          document.body.removeEventListener("touchend", resume, false);
          document.body.removeEventListener("click", resume, false);
          document.body.removeEventListener("keydown", resume, false);
        }
      };

      document.body.addEventListener("touchend", resume, false);
      document.body.addEventListener("click", resume, false);
      document.body.addEventListener("keydown", resume, false);
    } */
    // TODO: Maybe we can get rid of this now that we are using AudioAbstraction?
    /* this._staticSource = this._context.createGain(); // Just a noop node

    // @ts-ignore The way this class has to be monkey patched, makes it very hard to type.
    this._balance = new StereoBalanceNode(this._context);

    // Create the preamp node
    this._preamp = this._context.createGain();

    // Create the analyser node for the visualizer
    this._analyser = this._context.createAnalyser();
    this._analyser.fftSize = 2048;
    // don't smooth audio analysis
    this._analyser.smoothingTimeConstant = 0.0;

    // Create the gain node for the volume control
    this._gainNode = this._context.createGain();

    // Connect all the nodes in the correct way
    // (Note, source is created and connected later)
    //
    //                <source>
    //                    |
    //                    |_____________
    //                    |             \
    //                <preamp>          |
    //                    |             | <-- Optional bypass
    //           [...biquadFilters]     |
    //                    |_____________/
    //                    |
    //              <staticSource>
    //                    |
    //                <balance>
    //                    |
    //                    |\
    //                    | <analyser>
    //                  <gain>
    //                    |
    //              <destination>

    this._source = new ElementSource(this._context, this._staticSource);

    this._source.on("positionChange", () => {
      this._emitter.trigger("timeupdate");
    });
    this._source.on("ended", () => {
      this._emitter.trigger("ended");
    });
    this._source.on("statusChange", () => {
      switch (this._source.getStatus()) {
        case MEDIA_STATUS.PLAYING:
          this._emitter.trigger("playing");
          break;
      }
      this._emitter.trigger("timeupdate");
    });
    this._source.on("loaded", () => {
      this._emitter.trigger("fileLoaded");
    });

    this._staticSource.connect(this._preamp);

    let output = this._preamp;
    this._bands = {};

    BANDS.forEach((band, i) => {
      const filter = this._context.createBiquadFilter();

      this._bands[band] = filter;

      if (i === 0) {
        // The first filter, includes all lower frequencies
        filter.type = "lowshelf";
      } else if (i === BANDS.length - 1) {
        // The last filter, includes all higher frequencies
        filter.type = "highshelf";
      } else {
        filter.type = "peaking";
      }
      filter.frequency.value = band;
      filter.gain.value = 0;

      output.connect(filter);
      output = filter;
    });

    output.connect(this._balance);

    this._balance.connect(this._gainNode);
    this._balance.connect(this._analyser);

    this._gainNode.connect(this._context.destination); */
  }

  getAnalyser() {
    return this._analyser;
  }

  /* Properties */
  duration() {
    console.log("duration");
    return this._timeRemaining;
    /* return this._source.getDuration(); */
  }

  timeElapsed() {
    console.log("timeElapsed");
    return this._timeElapsed;
    /*   return this._source.getTimeElapsed(); */
  }

  timeRemaining() {
    console.log("timeRemaining");
    return this.duration() - this.timeElapsed();
  }

  percentComplete() {
    console.log("percentComplete");
    //return (this.timeElapsed() / this.duration()) * 100;
  }

  /* Actions */
  async play() {
    console.log("play");
    this.player.resume().then(() => {});
  }

  pause() {
    console.log("pause");
    this.player.pause().then(() => {});
  }

  stop() {
    console.log("stop");
    this.pause();
    this.seekToPercentComplete(0);
    //this._source.stop();
  }

  /* Actions with arguments */
  seekToPercentComplete(percent: number) {
    console.log(percent);
    console.log("seekToPercentComplete");

    const seekTime = this.duration() * (percent / 100);
    console.log(seekTime);

    clearInterval(this._timeInterval);
    this._timeInterval = null;
    this._timeElapsed = Math.floor(seekTime);
    this._emitter.trigger("timeupdate");

    this.player.seek(seekTime * 1000).then(() => {});

    // const seekTime = this.duration() * (percent / 100);
    // this.seekToTime(seekTime);
  }

  // From 0-1
  setVolume(volume: number) {
    console.log("setVolume");
    // Doesn't work when player not init already, find a better solution
    if (this.player)
      this.player.setVolume(volume / 100).then(() => {
        console.log("Volume updated!");
      });
  }

  // from 0 to 100
  // The input value here is 0-100 which is kinda wrong, since it represents -12db to 12db.
  // For now, 50 is 0db (no change).
  // Equation used is: 10^((dB)/20) = x, where x (preamp.gain.value) is passed on to gainnode for boosting or attenuation.
  setPreamp(value: number) {
    console.log("setPreamp");
    // const db = (value / 100) * 24 - 12;
    //this._preamp.gain.value = Math.pow(10, db / 20);
  }

  // From -100 to 100
  setBalance(balance: number) {
    console.log("setBalance");
    // Yo Dawg.
    // this._balance.balance.value = balance / 100;
  }

  setEqBand(band: any, value: number) {
    console.log("setEqBand");
    //  const db = (value / 100) * 24 - 12;
    //  this._bands[band].gain.value = db;
  }

  disableEq() {
    console.log("disableEq");
    // this._staticSource.disconnect();
    // this._staticSource.connect(this._balance);
  }

  enableEq() {
    console.log("enableEq");
    //  this._staticSource.disconnect();
    // this._staticSource.connect(this._preamp);
  }

  /* Listeners */
  on(event: string, callback: (...args: any[]) => void) {
    this._emitter.on(event, callback);
  }

  seekToTime(time: number) {
    console.log(time);
    console.log("seekToTime");
    //  this._source.seekToTime(time);
  }

  // Used only for the initial load, since it must have a CORS header
  async loadFromUrl(url: string, autoPlay: boolean) {
    console.log("loadFromURL");
    SpotifyApiService.put(`me/player/play?device_id=${this.device_id}`, {
      body: JSON.stringify({
        uris: [`spotify:track:${url}`]
      })
    });
  }

  dispose() {
    console.log("dispose");
    //  this._emitter.dispose();
  }
}
