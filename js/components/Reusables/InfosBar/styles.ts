import { greenSpotify } from "../../../styles/colors";
import { StyleCollection } from "../../../types";

const styles: StyleCollection = {
  container: {
    display: "flex",
    flexDirection: "column",
    backgroundColor: greenSpotify,
    borderBottomLeftRadius: 3,
    height: "auto",
    width: "auto",
    float: "right",
    paddingLeft: 14,
    paddingRight: 14,
    paddingTop: 10,
    paddingBottom: 10,
    transition: "transform 0.2s",
    transformOrigin: "right top",
    /*  -webkit-box-shadow: -11px 11px 29px -19px rgba(0, 0, 0, 0.79),
        -moz-box-shadow: -11px 11px 29px -19px rgba(0, 0, 0, 0.79), */
    boxShadow: "-11px 11px 29px -19px rgba(0, 0, 0, 0.79)",
    cursor: "pointer"
  },
  rowContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center"
  }
};

export default styles;
/* .infos-bar
  .infos-bar:hover {
    transform: scale(1.3);
  } */
