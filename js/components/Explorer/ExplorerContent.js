import React from "react";
import { connect } from "react-redux";
import Loader from "react-loaders";

import {
  viewAlbumsFromArtist,
  viewTracksFromAlbum,
  unsetFocusExplorer,
  playTrackFromExplorer,
  playAlbumFromExplorer,
  getArtistFromId,
  openImageModal,
  searchOnSpotify
} from "../../actionCreators";
import { SET_SELECTED_EXPLORER } from "../../actionTypes";
import { ExplorerContentStyle } from "./styles";
import ExplorerItem from "./ExplorerItem";

const { container } = ExplorerContentStyle;

class ExplorerContent extends React.Component {
  constructor(props) {
    super(props);
    this.timer = null;
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
        return this.renderAlbum(album, "al" + index);
      });
    return null;
  }

  renderTracks(tracks) {
    if (tracks)
      return tracks.map((track, index) => {
        return this.renderTrack(track, "tr" + index);
      });
    return null;
  }

  renderArtists(artists) {
    if (artists)
      return artists.map((artist, index) => {
        return this.renderArtist(artist, "ar" + index);
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
        infos={artist}
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
        infos={album}
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

  renderImage(image) {
    const selected = this.props.explorer.selected === -1;
    const title = this.props.explorer.title;
    return (
      <ExplorerItem
        selected={selected}
        type={"image"}
        image={image}
        onClick={() => this.clickHandler(-1)}
        onDoubleClick={() => this.props.openImage(image)}
      >
        {title}.jpg
      </ExplorerItem>
    );
  }

  renderPlaylistFile() {
    const selected = this.props.explorer.selected === -2;
    return (
      <ExplorerItem
        key={-2}
        selected={selected}
        type={"playlist"}
        onClick={() => this.clickHandler(-2)}
        onDoubleClick={() =>
          this.props.playAlbumFromExplorer(this.props.explorer.currentId)
        }
      >
        {this.props.explorer.title}.m3u
      </ExplorerItem>
    );
  }

  handleClickOutside(e) {
    if (e.target.className === "explorer-items-container") {
      e.preventDefault();
      this.props.unsetFocusExplorer();
    }
  }

  renderCategory(text) {
    if (this.props.explorer.currentId === "search") {
      const count = () => {
        switch (text) {
          case "Artists": {
            if (this.props.explorer.artists)
              return this.props.explorer.artists.length;
            return 0;
          }
          case "Albums": {
            if (this.props.explorer.albums)
              return this.props.explorer.albums.length;
            return 0;
          }
          case "Tracks": {
            if (this.props.explorer.tracks)
              return this.props.explorer.tracks.length;
            return 0;
          }
          default:
            return 0;
        }
      };
      return (
        <div style={ExplorerContentStyle.resultCategories}>
          {text} ({count()})
        </div>
      );
    }
    return null;
  }

  renderMore(type) {
    return (
      <div
        style={ExplorerContentStyle.moreButton}
        onClick={() =>
          this.props.searchOnSpotify(
            this.props.explorer.title,
            type,
            this.props.explorer.tracks.length.toString()
          )
        }
      >
        More...
      </div>
    );
  }

  renderLoadedItems() {
    const { artists, albums, tracks, image } = this.props.explorer;
    return (
      <div>
        {this.renderCategory("Artists")}
        {this.renderArtists(artists)}
        {this.props.explorer.artists &&
          this.props.explorer.currentId === "search" &&
          !(this.props.explorer.artists.length % 20) &&
          this.renderMore("artist")}
        {this.renderCategory("Albums")}
        {this.renderAlbums(albums)}
        {this.props.explorer.albums &&
          this.props.explorer.currentId === "search" &&
          !(this.props.explorer.albums.length % 20) &&
          this.renderMore("album")}
        {this.renderCategory("Tracks")}
        {this.renderTracks(tracks)}
        {this.props.explorer.tracks &&
          this.props.explorer.currentId === "search" &&
          !(this.props.explorer.tracks.length % 20) &&
          this.renderMore("track")}
        {this.props.explorer.image && this.renderImage(image)}
        {this.props.explorer.playlistable && this.renderPlaylistFile()}
      </div>
    );
  }

  renderLoader() {
    return (
      <div
        style={{
          color: "rgba(21, 108, 217, 0.5)",
          margin: "0 auto",
          paddingTop: "100px"
        }}
        className="la-line-scale la-2x"
      >
        <div />
        <div />
        <div />
        <div />
        <div />
      </div>
    );
  }

  render() {
    return (
      <div
        className="explorer-items-container"
        onMouseDown={e => this.handleClickOutside(e)}
        style={container}
      >
        {this.props.explorer.loading
          ? this.renderLoader()
          : this.renderLoadedItems()}
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
  openImage: source => dispatch(openImageModal(source)),
  searchOnSpotify: (search, type, offset) =>
    dispatch(searchOnSpotify(search, type, offset))
});

export default connect(mapStateToProps, mapDispatchToProps)(ExplorerContent);
