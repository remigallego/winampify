/** @jsx jsx */

import { jsx } from "@emotion/core";
import _ from "lodash";
import { Menu, MenuProvider, Item, Submenu } from "react-contexify";
import { FaChevronLeft, FaSpotify } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import {
  goPreviousState,
  setItems,
  setSearchResults
} from "../../../actions/explorer";
import { AppState } from "../../../reducers";
import { blueTitleBar, greenSpotify, greyLight } from "../../../styles/colors";
import { ACTION_TYPE } from "../../../types";
import SearchInput from "./SearchInput";
import styled from "styled-components";
interface Props {
  id: string;
}

const ICON_SIZE = 20;

export default (props: Props) => {
  const previousStatesLength = useSelector<AppState, number>(
    state => state.explorer.byId[props.id].previousStates.length
  );
  const dispatch = useDispatch();

  const startSearch = _.debounce((query: string) => search(query), 400);

  const search = (query: string) => dispatch(setSearchResults(query));

  const dispatchItems = (action: ACTION_TYPE) =>
    dispatch(setItems(action, null, props.id));

  return (
    <Container key={props.id}>
      <FlexRowContainer>
        <ArrowBack
          previousStatesLength={previousStatesLength}
          size={ICON_SIZE}
          color={previousStatesLength > 0 ? "black" : "rgba(0,0,0,0.2)"}
          onClick={() =>
            previousStatesLength > 0 ? dispatch(goPreviousState()) : null
          }
        />
        {props.id !== "landing-page" && (
          <Menu id={`spotify-menu-${props.id}`} style={{ zIndex: 9999 }}>
            <Item onClick={() => dispatchItems(ACTION_TYPE.TOP)}>
              Top Artists
            </Item>
            <Item onClick={() => dispatchItems(ACTION_TYPE.FOLLOWING)}>
              Following
            </Item>
            <Item onClick={() => dispatchItems(ACTION_TYPE.RECENTLY_PLAYED)}>
              Recently Played
            </Item>
            <Submenu label="Library">
              <Item onClick={() => dispatchItems(ACTION_TYPE.LIBRARY_ALBUMS)}>
                Albums
              </Item>
              <Item onClick={() => dispatchItems(ACTION_TYPE.LIBRARY_TRACKS)}>
                Tracks
              </Item>
            </Submenu>
          </Menu>
        )}
        <MenuProvider id={`spotify-menu-${props.id}`} event="onClick">
          <SpotifyIcon size={ICON_SIZE} />
        </MenuProvider>
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

const Container = styled.div`
  background-color: ${greyLight};
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

const ArrowBack = styled(FaChevronLeft)<{ previousStatesLength: number }>`
  &:hover {
    color: ${blueTitleBar};
  }
  &:active {
    transform: ${props =>
      props.previousStatesLength > 0 ? "scale(0.8)" : "scale(1)"};
  }
`;

const FlexRowContainer = styled.div`
  flex-direction: row;
  display: flex;
  padding-top: 2px;
`;

const SpotifyIcon = styled(FaSpotify)`
  padding-left: 10px;
  &:hover {
    fill: ${greenSpotify};
  }
  &:active {
    transform: scale(0.8);
  }
`;

const Form = styled.form`
  margin: 0;
  width: "auto";
`;
