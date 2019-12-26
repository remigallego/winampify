import React from "react";
import { useSelector } from "react-redux";
import { ThemeProvider } from "styled-components";
import { AppState } from "./reducers";

export default (props: any) => (
  <ThemeProvider theme={useSelector((state: AppState) => state.theme)}>
    {props.children}
  </ThemeProvider>
);
