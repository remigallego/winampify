import { GenericFile } from "../types";
import { isTrack } from "../types/typecheckers";

export const formatToWebampMetaData = (file: GenericFile) => {
  if (isTrack(file)) {
    const uri = file.metaData.uri.split(":");
    return {
      metaData: {
        artist: file.metaData.artists[0].name,
        title: file.metaData.name
      },
      url: uri[2],
      duration: file.metaData.duration_ms / 1000
    };
  }
};
