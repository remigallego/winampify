import { greenSpotify } from "../../../styles/colors";
import { StyleCollection } from "../../../types";

const styles: StyleCollection = {
  container: {
    backgroundColor: "white",
    padding: 2
  },
  resultCategories: {
    fontSize: "18px",
    paddingLeft: "2px",
    color: "#415b8e",
    paddingTop: "5px",
    paddingBottom: "5px",
    marginBottom: "5px",
    borderBottom: "0.7px solid #415b8e"
  },
  moreButton: {
    fontSize: "14px",
    cursor: "pointer",
    backgroundColor: "aliceblue",
    paddingLeft: 22,
    marginTop: 2
  },
  searchCategory: {
    userSelect: "none",
    position: "relative",
    display: "inline-block",
    overflow: "hidden",
    textOverflow: "ellipsis",
    width: "95%",
    fontWeight: 300,
    fontSize: 18,
    marginLeft: 20
    /*     backgroundColor: greenSpotify,
    background:
      */
    // tslint:disable-next-line: max-line-length
    // "linear-gradient(to bottom, rgba(29,185,84,0) 0%,rgba(29,185,84,0) 78%,rgba(29,185,84,1) 79%,rgba(29,185,84,1) 100%)"
  },
  searchSeparator: {
    backgroundColor: "rgba(0, 0, 0, 0.2)",
    height: 1,
    width: "100%"
  },
  noResults: {
    marginLeft: 20,
    opacity: 0.7,
    color: "grey",
    textAlign: "center",
    fontSize: 14
  }
};

export default styles;
