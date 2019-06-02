// this comment tells babel to convert jsx to calls to a function called jsx instead of React.createElement
/** @jsx jsx */

import { css, jsx } from "@emotion/core";
import _ from "lodash";
import React from "react";
import {
  ContextMenu,
  ContextMenuProvider,
  Item,
  Submenu
} from "react-contexify";
import { FaChevronLeft, FaSpotify } from "react-icons/fa";
import { connect } from "react-redux";
import { Action } from "redux";
import { ThunkDispatch } from "redux-thunk";
import {
  goPreviousState,
  setItems,
  setSearchResults
} from "../../../actions/explorer";
import { AppState } from "../../../reducers";
import { blueTitleBar, greenSpotify } from "../../../styles/colors";
import { ACTION_TYPE } from "../../../types";
import SearchInput from "./SearchInput";
import styles from "./styles";
interface OwnProps {
  id: string;
}

interface StateProps {
  previousStatesLength: number;
}

interface DispatchProps {
  setSearchResults(query: string): void;
  setItems(actionType: ACTION_TYPE, uri?: string): void;
  goPreviousState(): void;
}

interface State {
  types: string[];
}

type Props = DispatchProps & OwnProps & StateProps;

const ICON_SIZE = 20;

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
    this.props.setSearchResults(query);
  }

  render() {
    return (
      <div
        key={this.props.id}
        className="explorer-toolbar"
        style={styles.container}
      >
        <div style={{ flexDirection: "row", display: "flex", paddingTop: 2 }}>
          <FaChevronLeft
            size={ICON_SIZE}
            color={
              this.props.previousStatesLength > 0 ? "black" : "rgba(0,0,0,0.2)"
            }
            css={css`
              &:hover {
                color: ${blueTitleBar};
              }
              &:active {
                transform: ${this.props.previousStatesLength > 0
                  ? "scale(0.8)"
                  : "scale(1)"};
              }
            `}
            onClick={() => {
              return this.props.previousStatesLength > 0
                ? this.props.goPreviousState()
                : null;
            }}
          />

          {this.props.id !== "landing-page" && (
            <ContextMenu
              id={`spotify-menu-${this.props.id}`}
              style={{ zIndex: 9999 }}
            >
              <Item onClick={() => this.props.setItems(ACTION_TYPE.TOP)}>
                Top Artists
              </Item>
              <Item onClick={() => this.props.setItems(ACTION_TYPE.FOLLOWING)}>
                Following
              </Item>
              <Item
                onClick={() => this.props.setItems(ACTION_TYPE.RECENTLY_PLAYED)}
              >
                Recently Played
              </Item>
              <Submenu label="Library">
                <Item
                  onClick={() =>
                    this.props.setItems(ACTION_TYPE.LIBRARY_ALBUMS)
                  }
                >
                  Albums
                </Item>
                <Item
                  onClick={() =>
                    this.props.setItems(ACTION_TYPE.LIBRARY_TRACKS)
                  }
                >
                  Tracks
                </Item>
              </Submenu>
            </ContextMenu>
          )}
          <ContextMenuProvider
            id={`spotify-menu-${this.props.id}`}
            event="onClick"
          >
            <>
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
            </>
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

const mapStateToProps = (state: AppState, ownprops: OwnProps) => ({
  previousStatesLength: state.explorer.byId[ownprops.id].previousStates.length
});

const mapDispatchToProps = (
  dispatch: ThunkDispatch<AppState, null, Action>,
  ownProps: OwnProps
): DispatchProps => {
  return {
    // Using bindActionCreators here always generates an error in the setItems() call.
    // Let's keep this verbose syntax instead.
    setSearchResults: (query: string) => dispatch(setSearchResults(query)),
    goPreviousState: () => dispatch(goPreviousState()),
    setItems: (actionType: ACTION_TYPE, uri?: string) =>
      dispatch(setItems(actionType, uri, ownProps.id))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Toolbar);
