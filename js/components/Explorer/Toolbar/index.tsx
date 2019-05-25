// this comment tells babel to convert jsx to calls to a function called jsx instead of React.createElement
/** @jsx jsx */

import { css, jsx } from "@emotion/core";
import _ from "lodash";
import React from "react";
import { FaChevronLeft, FaSpotify } from "react-icons/fa";
import { connect } from "react-redux";
import { Action, bindActionCreators } from "redux";
import { ThunkDispatch } from "redux-thunk";
import { goPreviousState, setSearchResults } from "../../../actions/explorer";
import { AppState } from "../../../reducers";
import SearchInput from "./SearchInput";
import styles from "./styles";
import { selectSearch } from "../../../selectors/search";
import { greenSpotify } from "../../../styles/colors";
import { ContextMenuProvider, ContextMenu, Item } from "react-contexify";
interface OwnProps {
  id: string;
}

interface DispatchProps {
  setSearchResults(query: string, types: string[]): void;
  goPreviousState(): void;
}

interface State {
  types: string[];
}

type Props = DispatchProps & OwnProps;

const ICON_SIZE = 20;

const ContextMenus = () => {
  return (
    <ContextMenu id="spotify-menu" style={{ zIndex: 9999 }}>
      <Item onClick={() => null}>TODO</Item>
      <Item onClick={() => null}>TODO</Item>
      <Item onClick={() => null}>TODO</Item>
    </ContextMenu>
  );
};

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
        <div style={{ flexDirection: "row", display: "flex" }}>
          <FaChevronLeft
            size={ICON_SIZE}
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

          <ContextMenus />
          <ContextMenuProvider id="spotify-menu" event="onClick">
            <FaSpotify
              size={ICON_SIZE}
              css={css`
                padding-left: 10px;
                &:hover {
                  fill: ${greenSpotify};
                }
                &:active {
                  transform: scale(0.8);
                }
              `}
            />
          </ContextMenuProvider>
        </div>
        <form
          className="explorer-toolbar-searchbox"
          style={{
            margin: 0,
            width: "auto"
          }}
          onSubmit={e => e.preventDefault()}
        >
          <SearchInput
            id={this.props.id}
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
  undefined,
  mapDispatchToProps
)(Toolbar);
