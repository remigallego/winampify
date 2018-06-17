import React from "react";
import { connect } from "react-redux";

import {
  viewAlbumsFromArtist,
  viewTracksFromAlbum,
  unsetFocusExplorer,
  playTrackFromExplorer,
  playAlbumFromExplorer,
  getArtistFromId,
  openImageModal
} from "../../actionCreators";
import { SET_SELECTED_EXPLORER } from "../../actionTypes";
import { ExplorerContentStyle } from "./styles";
import ExplorerItem from "./ExplorerItem";

const { container } = ExplorerContentStyle;

class ExplorerContent extends React.Component {
  constructor(props) {
    super(props);
  }
  clickHandler(id) {
    this.props.click(id);
  }
  doubleClickHandler(id) {
    this.props.doubleclick(id);
  }
  openAlbumFolder(albumId) {
    this.props.viewTracksFromAlbum(albumId);
  }
  openArtistFolder(artistId) {
    this.props.viewAlbumsFromArtist(artistId);
  }

  renderAlbums(albums) {
    if (albums)
      return albums.map((album, index) => {
        return this.renderAlbum(album, index);
      });
    return null;
  }

  renderTracks(tracks) {
    if (tracks)
      return tracks.map((track, index) => {
        return this.renderTrack(track, index);
      });
    return null;
  }

  renderArtists(artists) {
    if (artists)
      return artists.map((artist, index) => {
        return this.renderArtist(artist, index);
      });
    return null;
  }

  renderArtist(artist, index) {
    const artistId = artist.id;
    const selected = this.props.explorer.selected === artistId;
    const fileName = artist.name;
    return (
      <ExplorerItem
        key={index}
        artist={artist}
        selected={selected}
        type={"artist"}
        onClick={() => this.clickHandler(artistId)}
        onDoubleClick={() => this.openArtistFolder(artistId)}
      >
        {fileName}
      </ExplorerItem>
    );
  }
  renderAlbum(album, index) {
    const selected = this.props.explorer.selected === index;
    const artist = album.artists.length > 0 ? album.artists[0].name : "unknown";
    return (
      <ExplorerItem
        key={index}
        selected={selected}
        type={"album"}
        image={album.images ? album.images[0].url : null}
        onClick={() => this.clickHandler(index)}
        onDoubleClick={() => this.openAlbumFolder(album.id)}
        releaseDate={album.release_date}
      >
        {artist} - {album.name}
      </ExplorerItem>
    );
  }

  renderTrack(track, index) {
    const selected = this.props.explorer.selected === index;
    const fileName = `${track.artists[0].name} - ${track.name}`;
    return (
      <ExplorerItem
        key={index}
        selected={selected}
        type={"track"}
        onClick={() => this.clickHandler(index)}
        onDoubleClick={() => this.props.playTrack(track.id)}
        infos={track}
      >
        {fileName}.mp3
      </ExplorerItem>
    );
  }
  renderSearch(results) {
    const { explorer } = this.props;
    return results.map((result, index) => {
      const resultId = result.id;
      let selected = false;
      const fileName = result.name;
      const artist = result;
      if (explorer.selected === resultId) selected = true;
      else selected = false;
      return (
        <ExplorerItem
          key={index}
          selected={selected}
          artist={artist}
          type={"artist"}
          image={result.images.length > 0 ? result.images[0].url : ""}
          onClick={() => this.clickHandler(resultId)}
          onDoubleClick={() => this.openArtistFolder(resultId)}
        >
          {fileName}
        </ExplorerItem>
      );
    });
  }

  renderCurrentView() {
    const { artists, albums, tracks, view } = this.props.explorer;
    if (view === "playlist") {
      console.log("playlist");
      return this.renderTracks(tracks.map(track => track.track));
    }
    return (
      <div>
        {this.renderAlbums(albums)}
        {this.renderTracks(tracks)}
        {this.renderArtists(artists)}
      </div>
    );
  }

  handleClickOutside(e) {
    if (e.target.className === "explorer-items-container") {
      e.preventDefault();
      this.props.unsetFocusExplorer();
    }
  }

  render() {
    return (
      <div
        className="explorer-items-container"
        onMouseDown={e => this.handleClickOutside(e)}
        style={container}
      >
        {this.renderCurrentView()}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  explorer: state.explorer,
  token: state.media.player.access_token
});

const mapDispatchToProps = dispatch => ({
  click: id => {
    dispatch({ type: SET_SELECTED_EXPLORER, selected: id });
  },
  playTrack: id => {
    dispatch(playTrackFromExplorer(id));
  },
  getArtistInfo: id => {
    dispatch(getArtistFromId(id));
  },
  viewAlbumsFromArtist: artist => dispatch(viewAlbumsFromArtist(artist)),
  viewTracksFromAlbum: album => dispatch(viewTracksFromAlbum(album)),
  unsetFocusExplorer: () => dispatch(unsetFocusExplorer()),
  playAlbumFromExplorer: currentId =>
    dispatch(playAlbumFromExplorer(currentId)),
  openImage: source => dispatch(openImageModal(source))
});

export default connect(mapStateToProps, mapDispatchToProps)(ExplorerContent);
