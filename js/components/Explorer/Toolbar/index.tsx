import _ from "lodash";
import React from "react";
import { Form } from "react-bootstrap";
import { FaChevronLeft, FaSearch } from "react-icons/fa";
import { connect } from "react-redux";
import { Action, bindActionCreators } from "redux";
import { ThunkDispatch } from "redux-thunk";
import { goPreviousState, setSearchResults } from "../../../actions/explorer";
import { AppState } from "../../../reducers";
import styles from "./styles";
import SearchInput from "./SearchInput";

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
      <div className="explorer-toolbar" style={styles.container}>
        <FaChevronLeft onClick={() => this.props.goPreviousState()} />
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
          {/*
          .input {
	
	// needs to be relative so the :focus span is positioned correctly
	position:relative;
	
	// bigger font size for demo purposes
	font-size: 1.5em;
	
	// the border gradient
	background: linear-gradient(21deg, #10abff, #1beabd);
	
	// the width of the input border
	padding: 3px;
	
	// we want inline fields by default
	display: inline-block;
	
	// we want rounded corners no matter the size of the field
	border-radius: 9999em;
	
	// style of the actual input field
	*:not(span) {
		position: relative;
		display: inherit;
		border-radius: inherit;
		margin: 0;
		border: none;
		outline: none;
		padding: 0 .325em;
		z-index: 1; // needs to be above the :focus span
		
		// summon fancy shadow styles when focussed
		&:focus + span {
			opacity: 1;
			transform: scale(1);
		}
  }
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
          <SearchInput />
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
