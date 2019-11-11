import { GenericFile, WebampTrackFormat } from "../types";
import { isAlbum, isTrack } from "../types/typecheckers";

export const formatMetaToWebampMeta = (file: any): WebampTrackFormat => {
  const uri = file.uri.split(":");
  if (file.type === "track")
    return {
      metaData: {
        artist: file.artists[0].name,
        title: file.name
      },
      url: uri[2],
      duration: file.duration_ms / 1000
    };
};
