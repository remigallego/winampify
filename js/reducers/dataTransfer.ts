import { WebampTrackFormat } from "../types";

export interface DataTransferState {
  dataTransferArray: WebampTrackFormat[];
}

export const initialStateDataTransfer: DataTransferState = {
  dataTransferArray: []
};

export const SET_DATA_TRANSFER_ARRAY = "SET_DATA_TRANSFER_ARRAY";

const dataTransfer = (
  state: DataTransferState = initialStateDataTransfer,
  action: any
) => {
  switch (action.type) {
    case SET_DATA_TRANSFER_ARRAY:
      return {
        ...state,
        dataTransferArray: action.payload.dataTransferArray
      };
    default:
      return state;
  }
};

export default dataTransfer;
