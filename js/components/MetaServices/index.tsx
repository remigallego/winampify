import React from "react";
import { useSelector } from "react-redux";
import { AppState } from "../../reducers";
import { HiddenMetadata } from "./WinampHiddenMetadata";

export const MetaServices = () => {
  const trackInfo = useSelector((x: AppState) => x.webamp.currentTrack);
  return (
    <>
      <HiddenMetadata track={trackInfo} />
    </>
  );
};
