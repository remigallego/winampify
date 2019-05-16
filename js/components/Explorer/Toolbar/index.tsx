import React from "react";
import { FaChevronLeft } from "react-icons/fa";
import { ThunkDispatch } from "redux-thunk";
import { AppState } from "../../../reducers";
import { Action, bindActionCreators } from "redux";
import { setSearchResults, goPreviousState } from "../../../actions/explorer";
import { connect } from "react-redux";
import _ from "lodash";
import { greyLight } from "../../../styles/colors";

interface OwnProps {}

interface DispatchProps {
  setSearchResults(query: string, types: string[]): void;
  goPreviousState(): void;
}

interface State {
  query: string;
  types: string[];
}

type Props = DispatchProps & OwnProps;

class Toolbar extends React.Component<Props, State> {
  startSearch: (() => void) & _.Cancelable;

  constructor(props: Props) {
    super(props);
    this.state = {
      query: "",
      types: ["album", "artist", "track"]
    };

    this.startSearch = _.debounce(this.search, 550);
  }

  search() {
    this.props.setSearchResults(this.state.query, this.state.types);
  }

  render() {
    return (
      <div
        className="explorer-toolbar"
        style={{
          backgroundColor: greyLight,
          height: "40px",
          flex: 1,
          minHeight: "40px",
          maxHeight: "40px",
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          paddingLeft: "5px",
          paddingRight: "5px"
        }}
      >
        <FaChevronLeft onClick={() => this.props.goPreviousState()} />
        <form
          className="explorer-toolbar-searchbox"
          style={{
            margin: 0,
            width: "auto"
          }}
          onSubmit={e => e.preventDefault()}
        >
          Album{" "}
          <input
            name="album"
            type="checkbox"
            checked={this.state.types.indexOf("album") !== -1}
            onChange={() => {
              if (this.state.types.indexOf("album") === -1)
                this.setState({ types: [...this.state.types, "album"] });
              else
                this.setState({
                  types: this.state.types.filter(t => t !== "album")
                });
            }}
          />
          Track{" "}
          <input
            name="track"
            type="checkbox"
            checked={this.state.types.indexOf("track") !== -1}
            onChange={() => {
              if (this.state.types.indexOf("track") === -1)
                this.setState({ types: [...this.state.types, "track"] });
              else
                this.setState({
                  types: this.state.types.filter(t => t !== "track")
                });
            }}
          />
          Artist{" "}
          <input
            name="artist"
            type="checkbox"
            checked={this.state.types.indexOf("artist") !== -1}
            onChange={() => {
              if (this.state.types.indexOf("artist") === -1)
                this.setState({ types: [...this.state.types, "artist"] });
              else
                this.setState({
                  types: this.state.types.filter(t => t !== "artist")
                });
            }}
          />
          <input
            type="text"
            value={this.state.query}
            onChange={e => {
              this.setState({ query: e.target.value });
              if (e.target.value !== "") this.startSearch();
            }}
          />
        </form>
      </div>
    );
  }
}

const mapDispatchToProps = (
  dispatch: ThunkDispatch<AppState, null, Action>
): DispatchProps =>
  bindActionCreators({ setSearchResults, goPreviousState }, dispatch);

export default connect(
  null,
  mapDispatchToProps
)(Toolbar);
