const ExplorerWindowStyle = {
  windowStyle: {
    position: "absolute",
    border: "2px solid #026bfe",
    borderRadius: "5px",
    overflow: "hidden",
    resize: "both",
    minWidth: "400px"
  },
  explorerTitle: {
    backgroundColor: "#0055e5",
    background: "linear-gradient(#026bfe, #1a6cd0)",
    width: "auto",
    height: "auto",
    cursor: "move"
  },
  explorerWrapper: {
    display: "flex",
    flexDirection: "column",
    height: "100%"
  },
  explorerTitleP: {
    display: "inline-block",
    fontFamily: "Trebuchet MS Bold",
    fontSize: "16px",
    color: "white",
    fontWeight: 500,
    margin: "0px",
    position: "relative",
    bottom: "3px",
    left: "5px",
    userSelect: "none"
  },
  explorerTitleImg: {
    pointerEvents: "none",
    width: "20px",
    height: "20px",
    display: "inline-block",
    userSelect: "none"
  },
  explorerToolbar: {
    backgroundColor: "#EFEBD6",
    height: "40px",
    flex: 1,
    minHeight: "40px",
    maxHeight: "40px",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingLeft: "5px",
    paddingRight: "5px"
  },
  backButtonStyle: {
    width: "50px",
    height: "20px"
  },
  searchbox: {
    margin: 0,
    width: "auto"
  },
  input: {
    paddingLeft: "10px",
    paddingRight: "10px",
    borderRadius: "10px",
    border: "1px solid rgba(0, 0, 0, 0.2)",
    transition: "all 500ms"
  },
  mainView: {
    display: "flex",
    backgroundColor: "white",
    height: "100%",
    width: "100%",
    overflow: "auto"
  }
};

const ExplorerTreeStyle = {
  explorerTree: {
    width: "150px",
    maxWidth: "150px",
    minWidth: "150px",
    height: "auto",
    borderRight: "2px solid #EFEBD6",
    paddingLeft: "3px"
  },
  explorerTreeText: {
    cursor: "pointer",
    userSelect: "none"
  },
  explorerTreeIcon: {
    marginRight: "5px",
    width: "14px",
    height: "14px"
  }
};

const ExplorerContentStyle = {
  container: {
    overflow: "scroll",
    overflowX: "hidden",
    backgroundColor: "white",
    width: "100%",
    borderBottom: "1px solid black"
  }
};

const ExplorerItemStyle = {
  itemStyle: {
    fontFamily: "Tahoma",
    cursor: "default",
    userSelect: "none",
    boxSizing: "border-box",
    height: "23px",
    width: "100%",
    whiteSpace: "nowrap",
    backgroundColor: "transparent"
  },
  fileName: {
    userSelect: "none",
    position: "relative",
    display: "inline-block"
  },
  iconWrapper: {
    position: "relative",
    display: "inline-block",
    marginRight: "5px",
    marginLeft: "2px",
    left: 0,
    top: 0,
    width: "14px",
    height: "14px"
  },
  iconBig: {
    position: "relative",
    width: "14px",
    height: "14px"
  },
  iconSmall: {
    position: "absolute",
    width: "8px",
    height: "8px",
    left: "6px",
    top: "6px"
  }
};

export {
  ExplorerWindowStyle,
  ExplorerTreeStyle,
  ExplorerContentStyle,
  ExplorerItemStyle
};
