import React from "react";
import { connect } from "react-redux";

import {
  goPreviousView,
  viewAlbumsFromArtist,
  viewTracksFromAlbum,
  unsetFocusExplorer,
  playTrackFromExplorer,
  playAlbumFromExplorer
} from "../../actionCreators";
import { SET_SELECTED_EXPLORER } from "../../actionTypes";
import { getAlbumInfos } from "../../spotifyParser";

import ExplorerItem from "./ExplorerItem";

class ExplorerContent extends React.Component {
  clickHandler(id) {
    this.props.click(id);
  }

  doubleClickHandler(id) {
    this.props.doubleclick(id);
  }
  openAlbumFolder(albumId) {
    this.props.viewTracksFromAlbum(albumId);
  }

  renderAlbumsFromArtist(albums) {
    const { explorer } = this.props;
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
        >
          {album.name}
        </ExplorerItem>
      );
    });
  }

  renderTracksFromAlbum(tracks) {
    const { explorer, playTrack } = this.props;
    const renderedTracks = tracks.map((track, index) => {
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
  renderTopArtistsFromUser(artists) {
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
          selected={selected}
          type={"artist"}
          image={artist.images.length > 0 ? artist.images[0].url : ""}
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
      if (explorer.selected === resultId) selected = true;
      else selected = false;
      return (
        <ExplorerItem
          key={index}
          selected={selected}
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
  openArtistFolder(artistId) {
    this.props.viewAlbumsFromArtist(artistId);
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
        return this.renderTopArtistsFromUser(artists);
      case "playlist":
        return this.renderTracksFromPlaylist(tracks);
      case "search":
        return this.renderSearch(artists)
      default:
        return null;
    }
  }

  openImage() {
    return undefined;
  }
  
  handleClick(e) {
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
        onClick={e => this.handleClick(e)}
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
  viewAlbumsFromArtist: artist => dispatch(viewAlbumsFromArtist(artist)),
  viewTracksFromAlbum: album => dispatch(viewTracksFromAlbum(album)),
  goPreviousView: () => dispatch(goPreviousView()),
  unsetFocusExplorer: () => dispatch(unsetFocusExplorer()),
  playAlbumFromExplorer: currentId => dispatch(playAlbumFromExplorer(currentId))
});

export default connect(mapStateToProps, mapDispatchToProps)(ExplorerContent);
