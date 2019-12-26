import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { openWebamp, setWebampInstance } from "../../actions/webamp";

export default () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setWebampInstance());
    dispatch(openWebamp());
  }, []);
  return <div id={"webamp"}></div>;
};
