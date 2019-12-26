import { Window } from "../reducers/windows";

export const findHighestPosition = (windows: Window[]): number => {
  const sol = windows.reduce((acc, curr) => {
    if (curr.position > acc) {
      return curr.position;
    }
    return acc;
  }, 0);
  return sol;
};
