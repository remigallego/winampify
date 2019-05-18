// this comment tells babel to convert jsx to calls to a function called jsx instead of React.createElement
/** @jsx jsx */

import { css, jsx } from "@emotion/core";
import _ from "lodash";
import React from "react";
import { FaChevronLeft } from "react-icons/fa";
import { connect } from "react-redux";
import { Action, bindActionCreators } from "redux";
import { ThunkDispatch } from "redux-thunk";
import { goPreviousState, setSearchResults } from "../../../actions/explorer";
import { AppState } from "../../../reducers";
import SearchInput from "./SearchInput";
import styles from "./styles";
interface OwnProps {}

interface DispatchProps {
  setSearchResults(query: string, types: string[]): void;
  goPreviousState(): void;
}

interface State {
  types: string[];
}

type Props = DispatchProps & OwnProps;

class Toolbar extends React.Component<Props, State> {
  startSearch: ((query: string) => void) & _.Cancelable;

  constructor(props: Props) {
    super(props);
    this.state = {
      types: ["album", "artist", "track"]
    };

    this.startSearch = _.debounce((query: string) => this.search(query), 400);
  }

  search(query: string) {
    this.props.setSearchResults(query, this.state.types);
  }

  render() {
    return (
      <div className="explorer-toolbar" style={styles.container}>
        <FaChevronLeft
          css={css`
            &:hover {
              color: rgba(0, 0, 0, 0.5);
            }
            &:active {
              transform: scale(0.8);
            }
          `}
          onClick={() => this.props.goPreviousState()}
        />
        <form
          className="explorer-toolbar-searchbox"
          style={{
            margin: 0,
            width: "auto"
          }}
          onSubmit={e => e.preventDefault()}
        >
          {/* Album{" "}
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
          */}

          {/* <input
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
          />*/}
          <SearchInput
            onChange={query => {
              if (query.length) this.startSearch(query);
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
