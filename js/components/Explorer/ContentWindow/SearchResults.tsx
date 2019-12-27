import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { BeatLoader } from "react-spinners";
import VirtualList from "react-tiny-virtual-list";
import { setMoreSearchResults } from "../../../actions/explorer";
import { AppState } from "../../../reducers";
import { SingleExplorerState } from "../../../reducers/explorer";
import {
  QueryState,
  SearchPaginationState
} from "../../../reducers/search-pagination";
import { selectSearch } from "../../../selectors/search";
import { blueTitleBar } from "../../../styles/colors";
import { GenericFile } from "../../../types";
import {
  isAlbum,
  isArtist,
  isPlaylist,
  isTrack
} from "../../../types/typecheckers";
import styles from "./styles";

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

  const getFilesOfType = (type: "track" | "artist" | "album" | "playlist") => {
    if (type === "artist") return props.files.filter(isArtist);
    if (type === "track") return props.files.filter(isTrack);
    if (type === "album") return props.files.filter(isAlbum);
    if (type === "playlist") return props.files.filter(isPlaylist);
    return [];
  };

  const renderCategoryHeader = (text: string) => (
    <div style={styles.searchCategory}>
      {`${text[0].toUpperCase()}${text.slice(1)}s`}
      <div style={styles.searchSeparator} />
    </div>
  );

  const renderNoResults = () => {
    return <div style={styles.noResults}>No results found</div>;
  };

  if (!searchPagination.filter.types.length)
    return (
      <div
        className="explorer-items-container"
        onMouseDown={handleClickOutside}
        style={{
          padding: 2,
          width: "100%"
        }}
      >
        <div style={styles.noResults}>
          Search filter is empty, please select at least one type.
        </div>
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
          {getFilesOfType(type).length === 0 && renderNoResults()}
          {getRemaining(type) > 0 && (
            <div
              style={styles.moreButton}
              onClick={() => dispatch(setMoreSearchResults(type))}
            >
              {searchPagination[type].loading ? (
                <BeatLoader color={blueTitleBar} size={5} />
              ) : (
                `${getRemaining(type)} more results...`
              )}
            </div>
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
