import eventListener from '../spotifyEvents'

export default class Media {
  constructor() {
    this.player = null
    this.getOAuthToken = null;
    this.id = null;
    this.name = null
    this.status = "PAUSED"
    this.access_token = null
  }

  setPlayer(player) {
    this.player = player
    this.getOAuthToken = player._options.getOAuthToken
    this.id = player._options.id
    this.name = player._options.name
    this.access_token = player._options.access_token
    this.player.addListener('player_state_changed', (state) => {

      // Seems to be the condition for a track to be considered as ended
      if(state.paused && state.position === 0 && state.duration === 0)
        eventListener.emit("ended", state)

      eventListener.emit("player_state_changed", state)
    });
    player.addListener('authentication_error', ({ message }) => { 
      eventListener.emit("token_expired", this.player.refresh_token)
     });
    
  }

  getDuration(callback) {
    this.player.getCurrentState().then(state => {
      callback(state.duration)
    });
  }

  playURI(URI) {
      this.getOAuthToken(access_token => {
        fetch(`https://api.spotify.com/v1/me/player/play?device_id=${this.id}`, {
          method: 'PUT',
          body: JSON.stringify({ uris: ["spotify:track:"+URI] }),
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${access_token}`
          },
        }).then(()=> {
          this.status = "PLAYING"
        })
      });
  }

  timeElapsed(callback) {
    if(this.status === "PLAYING") {
    this.player.getCurrentState().then(state => {
      if (!state) {
        console.error('User is not playing music through the Web Playback SDK')   
      }
      else {
        callback(state.position)
      }     
  }) }
    if(this.status === "STOPPED") {
      callback(0)
    }
  }


  /* Actions */
  play() {
    if(this.status === "PAUSED") {
      this.player.resume().then(() => {
         this.status = "PLAYING"        
      })
    }
    if(this.status === "STOPPED") {
      this.player.resume().then(() => {
         this.status = "PLAYING"        
      })
    }
  }

  pause() {
    if(this.status === "PAUSED")
      return null
    if(this.status === "PLAYING")
    this.player.pause().then(() => {
      this.status = "PAUSED"
    });
    // this._source.pause();
  }

  stop() {
    if(this.status === "PLAYING" || this.status === "PAUSED")
    this.player.seek(0).then(() => {
      this.player.pause().then(() => {
        this.status = "STOPPED"
      });
    });
    // this._source.stop();
  }

  /* Actions with arguments */
  seekToPercentComplete(percent) {
    this.getDuration((duration) => {
      const seekTime = duration * (percent / 100)
      this.player.seek(seekTime).then(() =>
        {
            eventListener.emit("unfocus");
        }
      )
    })
  }

  // From 0-1
  setVolume(volume) {
    this.player.setVolume(volume/100).then(() => {
    });
    // this._gainNode.gain.value = volume / 100;
  }

  // From 0-1
  setPreamp(value) {
    // this._preamp.gain.value = value / 100;
  }

  // From -100 to 100
  setBalance(balance) {
    /*let changeVal = Math.abs(balance) / 100;

    // Hack for Firefox. Having either channel set to 0 seems to revert us
    // to equal balance.
    changeVal = changeVal - 0.00000001;

    if (balance > 0) {
      // Right
      this._leftGain.gain.value = 1 - changeVal;
      this._rightGain.gain.value = 1;
    } else if (balance < 0) {
      // Left
      this._leftGain.gain.value = 1;
      this._rightGain.gain.value = 1 - changeVal;
    } else {
      // Center
      this._leftGain.gain.value = 1;
      this._rightGain.gain.value = 1;
    }
    this._balance = balance;*/
  }

  setEqBand(band, value) {
    // const db = value / 100 * 24 - 12;
    // this.bands[band].gain.value = db;
  }

  disableEq() {
    // this._staticSource.disconnect();
    // this._staticSource.connect(this._chanSplit);
  }

  enableEq() {
    // this._staticSource.disconnect();
    // this._staticSource.connect(this._preamp);
  }

  /* Listeners */
  addEventListener(event, callback) {
    // this._callbacks[event] = callback;
  }

  seekToTime(time) {
    // this._source.seekToTime(time);
  }

  // Used only for the initial load, since it must have a CORS header
  async loadFromUrl(url, fileName, autoPlay) {
    /*this.name = fileName;
    this._callbacks.waiting();
    await this._source.loadUrl(url);
    this._callbacks.stopWaiting();
    if (autoPlay) {
      this.play();
    }
  }*/
}}
