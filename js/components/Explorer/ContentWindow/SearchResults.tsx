import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { BeatLoader } from "react-spinners";
import VirtualList from "react-tiny-virtual-list";
import { setMoreSearchResults } from "../../../actions/explorer";
import { AppState } from "../../../reducers";
import { SingleExplorerState } from "../../../reducers/explorer";
import { QueryState } from "../../../reducers/search-pagination";
import { selectSearch } from "../../../selectors/search";
import { blueTitleBar } from "../../../styles/colors";
import { GenericFile } from "../../../types";
import {
  isAlbum,
  isArtist,
  isPlaylist,
  isTrack
} from "../../../types/typecheckers";
import styled from "styled-components";

interface Props {
  handleClickOutside: (e: any) => void;
  renderFile: (file: GenericFile) => void;
  setScrollOffset: (o: number) => void;
  scrollOffset: number;
  files: GenericFile[];
  explorer: SingleExplorerState;
}

/*
 * TODO:
 * This screen doesn't actually make use of the Virtualized List.
 * There needs to be a bigger refactoring to simplify the rendering of the different categories.
 */

export default (props: Props) => {
  const {
    handleClickOutside,
    setScrollOffset,
    scrollOffset,
    renderFile,
    explorer
  } = props;

  const searchPagination = useSelector<AppState, QueryState>(state =>
    selectSearch(state, explorer.id)
  );

  const dispatch = useDispatch();

  const getRemaining = (type: "track" | "artist" | "album" | "playlist") =>
    searchPagination[type].total - searchPagination[type].current;

  const getFilesOfType = (type: "track" | "artist" | "album" | "playlist") =>
    (type === "artist" && props.files.filter(isArtist)) ||
    (type === "track" && props.files.filter(isTrack)) ||
    (type === "album" && props.files.filter(isAlbum)) ||
    (type === "playlist" && props.files.filter(isPlaylist));

  const renderCategoryHeader = (text: string) => (
    <SearchCategory>
      {`${text[0].toUpperCase()}${text.slice(1)}s`}
      <Separator />
    </SearchCategory>
  );

  if (!searchPagination.filter.types.length)
    return (
      <div
        onMouseDown={handleClickOutside}
        style={{
          padding: 2,
          width: "100%"
        }}
      >
        <Text>Search filter is empty, please select at least one type.</Text>
      </div>
    );

  const renderCategoryResult = (
    type: "track" | "artist" | "album" | "playlist"
  ) => (
    <>
      {searchPagination.filter.types.includes(type) && (
        <>
          {renderCategoryHeader(type)}
          {(getFilesOfType(type) as GenericFile[]).map(renderFile)}
          {getFilesOfType(type).length === 0 && <Text>No results found</Text>}
          {getRemaining(type) > 0 && (
            <MoreButton onClick={() => dispatch(setMoreSearchResults(type))}>
              {searchPagination[type].loading ? (
                <BeatLoader color={blueTitleBar} size={5} />
              ) : (
                `${getRemaining(type)} more results...`
              )}
            </MoreButton>
          )}
          <div style={{ marginTop: 20 }} />
        </>
      )}
    </>
  );

  return (
    <VirtualList
      scrollOffset={scrollOffset}
      onScroll={setScrollOffset}
      width={"100%"}
      height={explorer.height - 68}
      itemCount={searchPagination.filter.types.length}
      itemSize={index => {
        if (getFilesOfType(searchPagination.filter.types[index]).length === 0)
          return 25 + 19;
        return (
          23 * getFilesOfType(searchPagination.filter.types[index]).length +
          (25 + 19 + 20)
        );
      }}
      renderItem={({ index, style }) => (
        <div key={index} style={style}>
          {renderCategoryResult(searchPagination.filter.types[index])}
        </div>
      )}
    />
  );
};

const SearchCategory = styled.div`
  user-select: none;
  position: relative;
  display: inline-block;
  overflow: hidden;
  text-overflow: ellipsis;
  width: 95%;
  font-weight: 300;
  font-size: 18px;
  margin-left: 20px;
  color: ${props => props.theme.explorer.file.text};
`;

const Separator = styled.div`
  background-color: ${props => props.theme.explorer.file.text};
  height: 1px;
  opacity: 0.4;
  width: 100%;
`;

const Text = styled.div`
  margin-left: 20px;
  color: ${props => props.theme.explorer.file.text};
  margin-left: 20px;
  opacity: 0.7;
  text-align: center;
  font-size: 14px;
`;

const MoreButton = styled.div`
  font-size: 14px;
  cursor: pointer;
  background-color: aliceblue;
  padding-left: 22px;
  margin-top: 2px;
`;
