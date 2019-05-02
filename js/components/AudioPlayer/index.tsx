import React from "react";

interface Props {
  onPlay: () => void;
  volume?: number;
  className?: string;
  children?: any;
  hidePlayer?: any;
  src?: any;
  preload?: any;
  autoPlay?: any;
  title?: any;
  mute?: any;
  loop?: any;
  onDragStart?: any;
  onDragMove?: any;
  onDragEnd?: any;
}

interface State {
  duration: number;
  currentTime: number;
  currentVolume: any;
  dragLeft: number;
  isDragging: boolean;
  isPlaying: boolean;
}

export default class AudioPlayer extends React.Component<Props, State> {
  volumeControl: any;
  slider: any;
  bar: any;
  constructor(props: Props) {
    super(props);
    this.state = {
      duration: 0,
      currentTime: 0,
      currentVolume: 0,
      dragLeft: 0,
      isDragging: false,
      isPlaying: false
    };
  }

  componentDidMount() {
    const slider = this.slider;

    let dragX: any;
    slider.addEventListener("dragstart", (e: any) => {
      e.dataTransfer.setData("text", "slider");
      if (e.dataTransfer.setDragImage) {
        const crt = slider.cloneNode(true);
        e.dataTransfer.setDragImage(crt, 0, 0);
      }
      document.addEventListener("dragover", event => {
        event = event || window.event;
        dragX = event.pageX;
      });
      this.props.onDragStart && this.props.onDragStart(e);
      this.setState({ isDragging: true });
    });

    slider.addEventListener("touchstart", (e: any) => {
      this.setState({ isDragging: true });
      this.props.onDragStart && this.props.onDragStart(e);
    });
    slider.addEventListener("drag", (e: any) => {
      if (dragX) {
        let dragLeft = dragX - this.bar.getBoundingClientRect().left;
        if (dragLeft < 0) {
          dragLeft = 0;
        } else if (dragLeft > this.bar.offsetWidth - 20) {
          dragLeft = this.bar.offsetWidth - 21;
        }
        this.setState({ dragLeft });
        this.props.onDragMove && this.props.onDragMove(e);
      }
    });
    slider.addEventListener("touchmove", (e: any) => {
      let dragLeft =
        e.touches[0].clientX - this.bar.getBoundingClientRect().left;
      if (dragLeft < 0) {
        dragLeft = 0;
      } else if (dragLeft > this.bar.offsetWidth - 20) {
        dragLeft = this.bar.offsetWidth - 21;
      }
      this.setState({ dragLeft });
      this.props.onDragMove && this.props.onDragMove(e);
    });
    slider.addEventListener("dragend", (e: any) => {
      this.setState({ isDragging: false });
      this.props.onDragEnd && this.props.onDragEnd(e);
    });
    slider.addEventListener("touchend", (e: any) => {
      this.setState({ isDragging: false });
      this.props.onDragEnd && this.props.onDragEnd(e);
    });
  }

  togglePlay() {
    this.props.onPlay();
  }

  volumnControlDrag(e: any) {
    if (e.clientX < 0) return;
    const relativePos =
      e.clientX - this.volumeControl.getBoundingClientRect().left;
    let currentVolume;
    if (relativePos < 0) {
      currentVolume = 0;
    } else if (relativePos > 45) {
      currentVolume = 1;
    } else {
      currentVolume = relativePos / 45;
    }
    e.currentTarget.style.cursor = "pointer";
    if (e.dataTransfer) {
      e.dataTransfer.dropEffect = "move";
    }
    this.setState({ currentVolume });
  }

  volumnControlDragOver(e: any) {
    e.dataTransfer.dropEffect = "move";
  }

  volumnControlDragStart(e: any) {
    // e.target.style.cursor = 'pointer'
    e.dataTransfer.setData("text", "volume");
    e.dataTransfer.effectAllowed = "move";
    if (e.dataTransfer.setDragImage) {
      const crt = e.target.cloneNode(true);
      e.dataTransfer.setDragImage(crt, 0, 0);
    }
  }

  /**
   * Set an interval to call props.onListen every props.listenInterval time period
   */
  setListenTrack() {
    /* if (!this.listenTracker) {
      const listenInterval = this.props.listenInterval;
      this.listenTracker = setInterval(() => {
        this.props.onListen && this.props.onListen(this.audio.currentTime);
      }, listenInterval);
    } */
  }

  /**
   * Clear the onListen interval
   */
  clearListenTrack() {
    /*  if (this.listenTracker) {
      clearInterval(this.listenTracker);
      this.listenTracker = null;
    } */
  }

  render() {
    const {
      className,
      volume,
      children,
      hidePlayer,
      src,
      preload,
      autoPlay,
      title = src,
      mute,
      loop
    } = this.props;
    const {
      currentTime,
      currentVolume,
      duration,
      isPlaying,
      dragLeft
    } = this.state;

    let currentTimeMin = Math.floor(currentTime / 60);
    let currentTimeSec = Math.floor(currentTime % 60);
    let durationMin = Math.floor(duration / 60);
    let durationSec = Math.floor(duration % 60);
    const addHeadingZero = (num: any) => (num > 9 ? num.toString() : `0${num}`);

    currentTimeMin = addHeadingZero(currentTimeMin);
    currentTimeSec = addHeadingZero(currentTimeSec);
    durationMin = addHeadingZero(durationMin);
    durationSec = addHeadingZero(durationSec);

    return (
      <div
        style={style.audioPlayerWrapper(hidePlayer)}
        className={`react-h5-audio-player ${className}`}
      >
        <div style={style.flexWrapper} className="flex">
          <div className="toggle-play-wrapper" style={style.togglePlayWrapper}>
            <a
              className="toggle-play-button"
              onClick={e => this.togglePlay(e)}
              style={style.togglePlay}
            >
              {isPlaying ? (
                <i className="pause-icon" style={style.pause} />
              ) : (
                <i className="play-icon" style={style.play} />
              )}
            </a>
          </div>
          <div
            className="progress-bar-wrapper"
            style={style.progressBarWrapper}
          >
            <div
              ref={ref => {
                this.bar = ref;
              }}
              style={style.progressBar}
            />
            {/*TODO: color change for sought part */}
            <div className="sought" />
            <div
              className="indicator"
              draggable="true"
              ref={ref => {
                this.slider = ref;
              }}
              style={style.drag(dragLeft)}
            />
            <div className="audio-info" style={style.audioInfo}>
              <div className="time" style={style.time}>
                <span className="current-time">
                  {currentTimeMin}:{currentTimeSec}
                </span>
                /
                <span className="total-time">
                  {durationMin}:{durationSec}
                </span>
              </div>
              <div
                ref={ref => {
                  this.volumeControl = ref;
                }}
                draggable={true}
                onDragStart={this.volumnControlDragStart}
                onDrag={this.volumnControlDrag}
                onDragOver={this.volumnControlDragOver}
                onMouseDown={this.volumnControlDrag}
                className="volume-controls"
                style={style.volumeControl}
              >
                <div className="volumn" style={style.volume(currentVolume)} />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const style = {
  audioPlayerWrapper(hidePlayer: any) {
    return {
      display: hidePlayer ? "none" : "block"
    };
  },
  flexWrapper: {
    boxSizing: "border-box",
    height: "70px",
    display: "flex",
    justifyContent: "space-between",
    width: "100%",
    padding: "15px 0",
    backgroundColor: "white",
    position: "relative",
    zIndex: "100",
    boxShadow: "0 0 3px 0 rgba(0, 0, 0, 0.2)"
  },
  pause: {
    boxSizing: "content-box",
    display: "block",
    width: "14px",
    height: "18px",
    borderLeft: "7px solid white",
    position: "relative",
    zIndex: "1",
    left: "9px",
    backgroundColor: "white",
    boxShadow: "inset 7px 0 0 0 rgb(251, 86, 21)"
  },
  play: {
    boxSizing: "content-box",
    display: "block",
    width: "0",
    height: "0",
    borderTop: "10px solid transparent",
    borderBottom: "10px solid transparent",
    borderLeft: "20px solid white",
    position: "relative",
    zIndex: "1",
    left: "13px"
  },
  togglePlayWrapper: {
    boxSizing: "border-box",
    flex: "1 0 60px",
    position: "relative"
  },
  togglePlay: {
    boxSizing: "border-box",
    position: "absolute",
    left: "50%",
    marginLeft: "-20px",
    backgroundColor: "#FB5615",
    color: "white",
    width: "40px",
    height: "40px",
    borderRadius: "50%",
    textAlign: "center",
    paddingTop: "10px"
  },
  progressBarWrapper: {
    height: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    boxSizing: "border-box",
    position: "relative",
    flex: "10 0 auto",
    alignSelf: "center",
    padding: "5px 4% 0 0"
  },
  progressBar: {
    boxSizing: "border-box",
    width: "100%",
    height: "5px",
    left: "0",
    background: "#e4e4e4"
  },
  drag(left: any) {
    return {
      boxSizing: "border-box",
      position: "absolute",
      width: "20px",
      height: "20px",
      left,
      top: "-3px",
      background: "skyblue",
      opacity: "0.8",
      borderRadius: "50px",
      boxShadow: "#fff 0 0 5px",
      cursor: "pointer"
    };
  },
  audioInfo: {
    display: "flex",
    justifyContent: "space-between"
  },
  time: {},
  volumeControl: {
    zIndex: 20,
    cursor: "pointer",
    position: "relative",
    width: 0,
    height: 0,
    borderBottom: "15px solid rgb(228, 228, 228)",
    borderLeft: "45px solid transparent"
  },
  volume(currentVolume: any) {
    const height = 15;
    return {
      zIndex: 19,
      position: "absolute",
      left: "-45px",
      bottom: "-15px",
      width: 0,
      height: 0,
      borderBottom: `${height * currentVolume}px solid skyblue`,
      borderLeft: `${height * currentVolume * 3}px solid transparent`
    };
  }
};
