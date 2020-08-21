export interface Theme {
  explorer: {
    bg: string;
    bgDrop: string;
    title: {
      bg: string;
    };
    file: {
      text: string;
    };
    toolbar: {
      bg: string;
      icon: string;
      iconDisabled: string;
    };
    scroll: string;
  };
  windows: {
    bgOutFocus: string;
  };
  folder: {
    color: string;
  };
}

export const defaultTheme: Theme = {
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
  },
  windows: {
    bgOutFocus: "grayscale(30%) brightness(93%) opacity(97%)"
  },
  folder: {
    color: "#d4be57"
  }
};

export const darkTheme: Theme = {
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
  },
  windows: {
    bgOutFocus: "grayscale(30%) brightness(34%) opacity(97%)"
  },
  folder: {
    color: "#d4be57"
  }
};
