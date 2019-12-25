import { StyleCollection } from "../../../types";

const styles: StyleCollection = {
  itemStyle: {
    fontFamily: "Open Sans",
    cursor: "default",
    userSelect: "none",
    boxSizing: "border-box",
    height: "23px",
    display: "flex",
    width: "100%", 
   /*  overflow: "hidden",
    whiteSpace: "nowrap", */
    backgroundColor: "transparent",
    border: "1px solid transparent"
  },
  fileName: {
    userSelect: "none",
    position: "relative",
    whiteSpace: "nowrap",
    textOverflow: "ellipsis",
    overflow: "hidden"
  },
  iconWrapper: {
    position: "relative",
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

export default styles;
