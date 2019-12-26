import uuidv1 from "uuid/v1";
import { AppState } from "../reducers";
import { WINDOW_TYPE } from "../reducers/windows";
import { findHighestPosition } from "./windows";

export const generateExplorerId = () => {
  return `explorer_${uuidv1()}`;
};

export const getActiveExplorerId = (state: AppState): string => {
  const explorers = state.windows.windows.filter(
    windowItem => windowItem.type === WINDOW_TYPE.Explorer
  );
  const ff = findHighestPosition(explorers);
  const activeExplorer = explorers.find(e => e.position === ff);

  if (activeExplorer) return activeExplorer.id;
  else {
    // tslint:disable-next-line: no-console
    console.error("No active explorer");
    return undefined;
  }
};
