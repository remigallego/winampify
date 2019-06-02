import { StyleCollection } from "../../types";

const styles: StyleCollection = {
  windowStyle: {
    position: "absolute",
    border: "2px solid #026bfe",
    borderRadius: "5px",
    overflow: "hidden",
    resize: "both",
    minWidth: "400px",
    minHeight: "200px"
  },
  explorerWrapper: {
    display: "flex",
    flexDirection: "column",
    height: "100%",
    width: "100%",
    boxShadow:
      "0 4px 8px 0 rgba(0, 0, 0, 0.4), 0 6px 20px 0 rgba(0, 0, 0, 0.30)"
  },
  backButtonStyle: {
    width: "50px",
    height: "20px"
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
    overflow: "auto",
    borderBottomLeftRadius: "inherit",
    borderBottomRightRadius: "inherit"
  }
};

export default styles;
