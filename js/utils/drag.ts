import { GenericFile } from "../types";

export const formatToWebampMetaData = (file: GenericFile) => {
  if (file.metaData.type === "track") {
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
