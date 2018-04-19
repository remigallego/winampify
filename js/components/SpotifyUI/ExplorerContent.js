import React from "react";
import { connect } from "react-redux";

import {
  goPreviousView,
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

  renderAlbumsFromArtist(albums) {
    const { explorer } = this.props;
    console.log(albums);
    return albums.map((album, index) => {
      let selected;
      if (explorer.selected === index) selected = true;
      else selected = false;
      return (
        <ExplorerItem
          key={index}
          selected={selected}
          type={"album"}
          image={album.images[0].url}
          onClick={() => this.clickHandler(index)}
          onDoubleClick={() => this.openAlbumFolder(album.id)}
          releaseDate={album.release_date}
        >
          {album.name}
        </ExplorerItem>
      );
    });
  }

  renderTracksFromAlbum(tracks) {
    const { explorer, playTrack } = this.props;
    const renderedTracks = tracks.map((track, index) => {
      console.log(track);
      const trackId = track.id;
      let selected = false;
      const fileName = `${track.artists[0].name} - ${track.name}`;
      if (explorer.selected === index) selected = true;
      else selected = false;
      return (
        <ExplorerItem
          key={index}
          selected={selected}
          type={"track"}
          onClick={() => this.clickHandler(index)}
          onDoubleClick={() => playTrack(trackId)}
          infos={track}
        >
          {fileName}.mp3
        </ExplorerItem>
      );
    });

    return <div>{renderedTracks}</div>;
  }

  renderTracksFromPlaylist(tracks) {
    const { explorer, playTrack } = this.props;
    return tracks.map((recentTrack, index) => {
      const trackId = recentTrack.track.id;
      let selected = false;
      const fileName = `${recentTrack.track.artists[0].name} - ${
        recentTrack.track.name
      }`;
      if (explorer.selected === index) selected = true;
      else selected = false;
      return (
        <ExplorerItem
          key={index}
          selected={selected}
          type={"track"}
          onClick={() => this.clickHandler(index)}
          onDoubleClick={() => playTrack(trackId)}
          infos={recentTrack.track}
        >
          {fileName}.mp3
        </ExplorerItem>
      );
    });
  }

  renderArtists(artists) {
    const { explorer } = this.props;
    return artists.map((artist, index) => {
      const artistId = artist.id;
      let selected = false;
      const fileName = artist.name;
      if (explorer.selected === artistId) selected = true;
      else selected = false;
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
    });
  }
  renderSearch(results) {
    const { explorer } = this.props;
    return results.map((result, index) => {
      const resultId = result.id;
      let selected = false;
      const fileName = result.name;
      const artist = result;
      console.log("here");
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
    const {
      view,
      artists,
      albums,
      tracks,
      selected,
      currentId,
      title,
      image
    } = this.props.explorer;
    switch (view) {
      case "artist":
        return this.renderAlbumsFromArtist(albums);
      case "album":
        return (
          <div>
            {this.renderTracksFromAlbum(tracks)}
            <ExplorerItem
              key={tracks.length}
              selected={selected === tracks.length}
              type={"playlist"}
              onClick={() => this.clickHandler(tracks.length)}
              onDoubleClick={() => this.props.playAlbumFromExplorer(currentId)}
            >
              {title}.m3u
            </ExplorerItem>
            <ExplorerItem
              key={tracks.length + 1}
              selected={selected === tracks.length + 1}
              type={"image"}
              image={image}
              onClick={() => this.clickHandler(tracks.length + 1)}
              onDoubleClick={() => this.props.openImage(image)}
            >
              cover.jpg
            </ExplorerItem>
          </div>
        );
      case "user":
        return this.renderArtists(artists);
      case "playlist":
        return this.renderTracksFromPlaylist(tracks);
      case "search":
        return this.renderSearch(artists);
      default:
        return null;
    }
  }

  handleClickOutside(e) {
    console.log(e.target);
    e.target.className === "explorer-items-container"
      ? e.preventDefault()
      : null;
    if (
      e.target.classList[0] !== "explorer-item" &&
      e.target.parentNode.classList[0] !== "explorer-item"
    )
      this.props.unsetFocusExplorer();
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
  goPreviousView: () => dispatch(goPreviousView()),
  unsetFocusExplorer: () => dispatch(unsetFocusExplorer()),
  playAlbumFromExplorer: currentId =>
    dispatch(playAlbumFromExplorer(currentId)),
  openImage: source => dispatch(openImageModal(source))
});

export default connect(mapStateToProps, mapDispatchToProps)(ExplorerContent);
