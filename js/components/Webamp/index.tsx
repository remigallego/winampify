import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  closeWebamp,
  openWebamp,
  removeWebamp,
  setConnectedWebamp,
  setOfflineWebamp
} from "../../actions/webamp";
import { AppState } from "../../reducers";

export default () => {
  const isLogged = useSelector((state: AppState) => state.auth.logged);
  const webampObject = useSelector(
    (state: AppState) => state.webamp.webampObject
  );
  const dispatch = useDispatch();

  webampObject?.onClose(() => dispatch(closeWebamp()));

  useEffect(() => {
    if (isLogged) {
      if (webampObject) {
        dispatch(removeWebamp());
        dispatch(setConnectedWebamp());
      }
    } else dispatch(setOfflineWebamp());

    dispatch(openWebamp());

    return () => {};
  }, [isLogged]);
  return <div id={"webamp-container"}></div>;
};
