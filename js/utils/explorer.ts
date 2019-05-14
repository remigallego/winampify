import uuidv1 from "uuid/v1";
import { AppState } from "../reducers";
import { WINDOW_TYPE } from "../reducers/windows";

export const generateExplorerId = () => {
  return `explorer_${uuidv1()}`;
};

export const getActiveExplorerId = (state: AppState): string => {
  const activeExplorer = state.windows.windows
    .slice()
    .reverse()
    .find(windowItem => windowItem.type === WINDOW_TYPE.Explorer);

  if (activeExplorer) return activeExplorer.id;
  else throw new Error("No active explorer");
};
