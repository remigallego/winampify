import React, { useEffect } from "react";
import { AppState } from "../../reducers";
import { useSelector, useDispatch } from "react-redux";
import { openWebamp } from "../../actions/webamp";

export default () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(openWebamp());
  }, []);
  return <div id={"webamp"}></div>;
};
