import { SimplifiedTrack } from "../types";

export interface DataTransferState {
  tracks: SimplifiedTrack[];
  source: string;
}

export const initialStateDataTransfer: DataTransferState = {
  tracks: [],
  source: ""
};

export const SET_DATA_TRANSFER_TRACKS = "SET_DATA_TRANSFER_TRACKS";

const dataTransfer = (
  state: DataTransferState = initialStateDataTransfer,
  action: any
) => {
  switch (action.type) {
    case SET_DATA_TRANSFER_TRACKS:
      return {
        ...state,
        tracks: action.payload.tracks,
        source: action.payload.source
      };
    default:
      return state;
  }
};

export default dataTransfer;
