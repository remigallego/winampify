import { AppState } from "../reducers";

export const selectSearch = (state: AppState, props: any) => {
  const id = props.explorer.id;
  return state.searchPagination[`${id}`];
};
