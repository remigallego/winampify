import { ThemeState } from "../reducers/theme";

/* Pre-configured Themes: */

export const defaultTheme: ThemeState = {
  explorer: {
    bg: "white",
    bgDrop: "rgb(13,256,187)",
    title: {
      bg: "#0055e5"
    },
    file: {
      text: "black"
    },
    toolbar: {
      bg: "#E8E8E8",
      icon: "black",
      iconDisabled: "rgba(0, 0, 0, 0.2)"
    },
    scroll: "rgba(0,0,0,.5)"
  }
};

export const darkTheme: ThemeState = {
  explorer: {
    bg: "black",
    bgDrop: "rgb(13,256,187)",
    title: {
      bg: "black"
    },
    file: {
      text: "white"
    },
    toolbar: {
      bg: "rgb(30,30,30)",
      icon: "white",
      iconDisabled: "rgba(255,255,255,0.3)"
    },
    scroll: "white"
  }
};
