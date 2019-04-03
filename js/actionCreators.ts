import { S_UPDATE_PLAYER_OBJECT, GO_PREVIOUS_STATE } from "./actionTypes";
import { Action, Dispatch } from "redux";

export function goPreviousState(explorerId: string) {
  return (dispatch: Dispatch<Action>) => {
    dispatch({ type: GO_PREVIOUS_STATE, payload: { id: explorerId } });
  };
}

// TODO: Type of p to be defined
export function createPlayerObject(p: any) {
  const player = p;
  const id = player._options.id;
  const getOAuthToken = player._options.getOAuthToken;
  const timeMode = "ELAPSED";
  const volume = player._options.volume * 100;
  const name = player._options.name;
  const timeElapsed = 0;
  const balance = 0;
  const channels = null;
  const shuffle = false;
  const repeat = false;
  const status = "STOPPED";
  return {
    type: S_UPDATE_PLAYER_OBJECT,
    player: player,
    id: id,
    getOAuthToken: getOAuthToken,
    timeMode: timeMode,
    volume: volume,
    name: name,
    timeElapsed: timeElapsed,
    length: length,
    balance: balance,
    channels: channels,
    shuffle: shuffle,
    repeat: repeat,
    status: status
  };
}
