import { greyLight } from "../../../styles/colors";
import { StyleCollection } from "../../../types";

const styles: StyleCollection = {
  container: {
    backgroundColor: greyLight,
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
  }
};

export default styles;
