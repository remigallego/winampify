import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { openWebamp } from "../../actions/webamp";
import { AppState } from "../../reducers";

export default () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(openWebamp());
  }, []);
  return <div id={"webamp"}></div>;
};
