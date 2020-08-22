import React, { FC } from "react";
import { TrackInfo } from "webamp";

interface HiddenMetadataProps {
  track?: TrackInfo;
}

/***
 * Metadata used in web-scrobbler plugin.
 * Web-scrobbler connectors use DOM elements to figure out what's playing now
 * @see https://github.com/web-scrobbler/web-scrobbler/wiki/Connectors-development
 */
export const HiddenMetadata: FC<HiddenMetadataProps> = ({ track }) => (
  <div id="winamp-meta" style={{ display: "none" }}>
    {track && (
      <>
        <p id="winamp-meta-artist">{track.metaData.artist}</p>
        <p id="winamp-meta-title">{track.metaData.title}</p>
        <p id="winamp-meta-album">{track.metaData.album}</p>
      </>
    )}
  </div>
);
