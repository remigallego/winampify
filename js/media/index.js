import eventListener from "../SpotifyEvents";

class Media {
  constructor() {
    this.player = null;
    this.getOAuthToken = null;
    this.id = null;
    this.name = null;
    this.status = "PAUSED";
    this.accessToken = null;
  }

  setPlayer(player) {
    this.player = player;
    this.getOAuthToken = player._options.getOAuthToken;
    this.id = player._options.id;
    this.name = player._options.name;
    this.accessToken = player._options.accessToken;
    this.player.addListener("player_state_changed", state => {
      // Seems to be the condition for a track to be considered as ended
      if (state.paused && state.position === 0) {
        if (this.status !== "STOPPED") {
          this.status = "STOPPED";
          eventListener.emit("track_ended", state);
        }
      }

      eventListener.emit("player_state_changed", state);
    });
    player.addListener("authentication_error", ({ message }) => {
      console.log("Token should be refreshed.");
      console.log(message);
      eventListener.emit("token_expired", this.player.refreshToken);
    });
  }

  getDuration(callback) {
    this.player.getCurrentState().then(state => {
      callback(state.duration);
    });
  }

  playURI(URI) {
    console.log(URI);
    if (URI.length > 22) {
      URI = URI.slice(14, URI.length);
    }
    this.getOAuthToken(accessToken => {
      fetch(`https://api.spotify.com/v1/me/player/play?device_id=${this.id}`, {
        method: "PUT",
        body: JSON.stringify({ uris: [`spotify:track:${URI}`] }),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`
        }
      }).then(() => {
        this.status = "PLAYING";
      });
    });
  }

  timeElapsed(callback) {
    if (this.status === "PLAYING") {
    }
    if (this.status === "STOPPED") {
      callback(0);
    }
  }

  /* Actions */
  play() {
    if (this.status === "PAUSED") {
      this.player.resume().then(() => {
        this.status = "PLAYING";
      });
    }
    if (this.status === "STOPPED") {
      this.player.resume().then(() => {
        this.status = "PLAYING";
      });
    }
  }

  pause() {
    if (this.status === "PAUSED") return null;
    if (this.status === "PLAYING")
      this.player.pause().then(() => {
        this.status = "PAUSED";
      });
    // this._source.pause();
  }

  stop() {
    if (this.status === "PLAYING" || this.status === "PAUSED")
      this.player.seek(0).then(() => {
        this.player.pause().then(() => {
          this.status = "STOPPED";
        });
      });
    // this._source.stop();
  }

  /* Actions with arguments */
  seekToPercentComplete(percent) {
    this.getDuration(duration => {
      const seekTime = duration * (percent / 100);
      this.player.seek(seekTime).then(() => {
        eventListener.emit("unfocus");
      });
    });
  }

  // From 0-1
  setVolume(volume) {
    this.player.setVolume(volume / 100);
  }
}

export default new Media();
