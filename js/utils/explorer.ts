import uuidv1 from "uuid/v1";
import { AppState } from "../reducers";
import { selectWindows } from "../selectors/windows";
import { selectExplorers } from "../selectors/explorer";

export const generateExplorerId = () => {
  return `explorer_${uuidv1()}`;
};

export const getActiveExplorerId = (state: AppState): string => {
  const explorers = selectExplorers(state);

  return explorers[0].id; // TODO: Doesn't work right now, use Windows state
};
