/** @jsx jsx */

import { jsx } from "@emotion/core";
import _ from "lodash";
import { Item, Menu, MenuProvider, Submenu } from "react-contexify";
import { FaChevronLeft, FaPlay, FaPlus, FaSpotify } from "react-icons/fa";
import { IconType } from "react-icons/lib/cjs";
import { useDispatch, useSelector } from "react-redux";
import { Tooltip } from "react-tippy";
import styled, { css } from "styled-components";
import {
  goPreviousState,
  setItems,
  setSearchResults
} from "../../../actions/explorer";
import { appendTracks, setTracksToPlay } from "../../../actions/webamp";
import { AppState } from "../../../reducers";
import { blueTitleBar, greenSpotify, greyLight } from "../../../styles/colors";
import { OPEN_FOLDER_ACTION } from "../../../types";
import { isTrack } from "../../../types/typecheckers";
import SearchInput from "./SearchInput";

interface Props {
  id: string;
}

const ICON_SIZE = 20;

export default (props: Props) => {
  const previousStatesLength = useSelector<AppState, number>(
    state => state.explorer.byId[props.id].previousStates.length
  );
  const allExplorerFiles = useSelector(
    (state: AppState) => state.explorer.byId[props.id].files
  );
  const dispatch = useDispatch();

  const startSearch = _.debounce((query: string) => search(query), 400);

  const search = (query: string) => dispatch(setSearchResults(query));

  const dispatchItems = (action: OPEN_FOLDER_ACTION) =>
    dispatch(setItems(action, null, props.id));

  return (
    <Container key={props.id}>
      <FlexRowContainer>
        <Tooltip
          title="Go back"
          position="bottom"
          trigger={"mouseenter"}
          delay={600}
          size={"small"}
          animation={"none"}
        >
          <ArrowIcon
            disabled={previousStatesLength === 0}
            size={ICON_SIZE}
            color={previousStatesLength > 0 ? "black" : "rgba(0,0,0,0.2)"}
            onClick={() =>
              previousStatesLength > 0 ? dispatch(goPreviousState()) : null
            }
          />
        </Tooltip>
        {props.id !== "landing-page" && (
          <Menu id={`spotify-menu-${props.id}`} style={{ zIndex: 9999 }}>
            <Item onClick={() => dispatchItems(OPEN_FOLDER_ACTION.TOP)}>
              Top Artists
            </Item>
            <Item onClick={() => dispatchItems(OPEN_FOLDER_ACTION.FOLLOWING)}>
              Following
            </Item>
            <Item
              onClick={() => dispatchItems(OPEN_FOLDER_ACTION.RECENTLY_PLAYED)}
            >
              Recently Played
            </Item>
            <Submenu label="Library">
              <Item
                onClick={() => dispatchItems(OPEN_FOLDER_ACTION.LIBRARY_ALBUMS)}
              >
                Albums
              </Item>
              <Item
                onClick={() => dispatchItems(OPEN_FOLDER_ACTION.LIBRARY_TRACKS)}
              >
                Tracks
              </Item>
            </Submenu>
          </Menu>
        )}

        <MenuProvider id={`spotify-menu-${props.id}`} event="onClick">
          <Tooltip
            title="Spotify"
            position="bottom"
            trigger={"mouseenter"}
            delay={600}
            size={"small"}
            animation={"none"}
          >
            <SpotifyIcon style={{ paddingLeft: 5 }} size={ICON_SIZE} />
          </Tooltip>
        </MenuProvider>
        <Tooltip
          title="Play tracks on Winamp"
          position="bottom"
          trigger={"mouseenter"}
          delay={600}
          size={"small"}
          animation={"none"}
        >
          <PlayIcon
            style={{ paddingLeft: 5 }}
            onClick={() => {
              if (allExplorerFiles.filter(isTrack).length > 0)
                dispatch(setTracksToPlay(allExplorerFiles.filter(isTrack)));
            }}
            disabled={allExplorerFiles.filter(isTrack).length === 0}
            size={ICON_SIZE}
          ></PlayIcon>
        </Tooltip>
        <Tooltip
          title="Queue tracks on Winamp"
          position="bottom"
          size={"small"}
          trigger={"mouseenter"}
          delay={600}
          animation={"none"}
        >
          <PlusIcon
            style={{ paddingLeft: 5 }}
            size={ICON_SIZE}
            disabled={allExplorerFiles.filter(isTrack).length === 0}
            onClick={() => {
              if (allExplorerFiles.filter(isTrack).length > 0)
                dispatch(appendTracks(allExplorerFiles.filter(isTrack)));
            }}
          ></PlusIcon>
        </Tooltip>
      </FlexRowContainer>
      <Form onSubmit={e => e.preventDefault()}>
        <SearchInput
          id={props.id}
          onChange={query => {
            if (query.length) startSearch(query);
          }}
        />
      </Form>
    </Container>
  );
};

const onHover = () => css`
  transition: fill 0.1s;
  &:hover {
    fill: ${greenSpotify};
  }
`;

const onActive = () => css`
  &:active {
    transform: scale(0.8);
  }
`;

const Container = styled.div`
  transition: background-color 0.3s;
  background-color: ${props => props.theme.explorer.toolbar.bg};
  height: 40px;
  flex: 1;
  min-height: 40px;
  max-height: 40px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding-left: 5px;
  padding-right: 5px;
`;

const FlexRowContainer = styled.div`
  flex-direction: row;
  display: flex;
  padding-top: 2px;
  flex: 1;
`;

const Form = styled.form`
  margin: 0;
  width: "auto";
`;

const Icon = (icon: IconType) => styled(icon)<{ disabled?: boolean }>`
  ${props => !props.disabled && onHover()}
  ${props => !props.disabled && onActive()};
  fill: ${props =>
    props.disabled
      ? props.theme.explorer.toolbar.iconDisabled
      : props.theme.explorer.toolbar.icon};
`;
const SpotifyIcon = Icon(FaSpotify);
const ArrowIcon = Icon(FaChevronLeft);
const PlusIcon = Icon(FaPlus);
const PlayIcon = Icon(FaPlay);
