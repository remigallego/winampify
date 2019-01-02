import React from "react";
import { connect } from "react-redux";
import Rnd from "react-rnd";
import { goPreviousState } from "../../actionCreators";
import { searchOnSpotify } from "../../actions/explorer";
import { ExplorerWindowStyle } from "./styles.js";
import magnifier from "./images/magnifier.png";
import backButton from "./images/Back.png";
import ExplorerTree from "./ExplorerTree";
import ExplorerContent from "./ExplorerContent";

class ExplorerWindow extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      width: 320,
      height: 200,
      x: 0,
      y: 0,
      searchText: ""
    };
  }

  goBack() {
    this.props.goPreviousState();
  }

  onDragStop(d) {
    const { clientHeight, clientWidth } = document.documentElement;

    const getX = () => {
      if (d.x < 0) return 0;
      if (d.x + Number(this.state.width) > clientWidth)
        return clientWidth - Number(this.state.width);
      return d.x;
    };
    const getY = () => {
      if (d.y < 0) return 0;
      if (d.y + Number(this.state.height) > clientHeight)
        return clientHeight - Number(this.state.height);
      return d.y;
    };

    this.setState({ x: getX(), y: getY() });
  }

  render() {
    console.log(this.props.id);
    console.log(this.props.explorer);
    const {
      windowStyle,
      explorerTitle,
      explorerTitleImg,
      explorerTitleP,
      explorerToolbar,
      backButtonStyle,
      explorerWrapper,
      searchbox,
      mainView
    } = ExplorerWindowStyle;

    windowStyle.height = this.state.height;
    windowStyle.width = this.state.width;
    return (
      <Rnd
        enableResizing={{
          top: false,
          right: true,
          bottom: true,
          left: false,
          topRight: false,
          bottomRight: true,
          bottomLeft: false,
          topLeft: false
        }}
        default={{
          x: 0,
          y: 0,
          width: this.state.width,
          height: this.state.height
        }}
        position={{ x: this.state.x, y: this.state.y }}
        minWidth={400}
        minHeight={200}
        //onDrag={() => console.log(this.state)}
        onResizeStop={(e, direction, ref) => {
          this.setState({
            width: ref.style.width.substring(0, ref.style.width.length - 2),
            height: ref.style.height.substring(0, ref.style.height.length - 2)
          });
        }}
        onDragStop={(e, d) => this.onDragStop(d)}
        enableUserSelectHack
        dragHandleClassName=".explorer-title"
      >
        <div
          className="explorer-handle"
          style={{ position: "absolute", height: "100", width: "100%" }}
        />
        <div className="explorer-wrapper" style={explorerWrapper}>
          <div className="explorer-title" style={explorerTitle}>
            <img src={magnifier} style={explorerTitleImg} />
            <p style={explorerTitleP}>{this.props.explorer.title}</p>
          </div>
          <div className="explorer-toolbar" style={explorerToolbar}>
            <img
              className="explorer-toolbar-backbutton"
              src={backButton}
              style={backButtonStyle}
              onClick={() => {
                if (this.props.explorer.previousStates.length > 1) {
                  this.goBack();
                }
              }}
            />
            <form
              className="explorer-toolbar-searchbox"
              style={searchbox}
              onSubmit={e => {
                e.preventDefault();
                this.props.searchOnSpotify(
                  e.target[0].value,
                  "album,artist,playlist,track",
                  "0"
                );
              }}
            >
              <input
                type="text"
                value={this.state.searchText}
                onChange={e => this.setState({ searchText: e.target.value })}
              />
            </form>
          </div>
          <div className="explorer-mainview" style={mainView}>
            <ExplorerTree {...this.props} />
            <ExplorerContent {...this.props} />
          </div>
        </div>
      </Rnd>
    );
  }
}

const mapStateToProps = (state, ownProps) => ({
  playlist: state.playlist,
  explorer: state.explorer.byId[ownProps.explorerId]
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  searchOnSpotify: (search, type, offset) =>
    dispatch(searchOnSpotify(search, type, offset, ownProps.explorerId)),
  goPreviousState: () => dispatch(goPreviousState(ownProps.explorerId))
});
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ExplorerWindow);
