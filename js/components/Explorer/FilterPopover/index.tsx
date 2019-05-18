// this comment tells babel to convert jsx to calls to a function called jsx instead of React.createElement
/** @jsx jsx */
import { css, jsx, keyframes } from "@emotion/core";
import { ChangeEvent, useState } from "react";
import { ArrowContainer, ContentRendererArgs } from "react-tiny-popover";
import { blueTitleBar } from "../../../styles/colors";
import Separator from "../../Reusables/Separator";
import { connect } from "react-redux";
import { ThunkDispatch } from "redux-thunk";
import { AppState } from "../../../reducers";
import { Action, bindActionCreators } from "redux";
import { updateFilter, Filter } from "../../../actions/search-pagination";
import { SEARCH_CATEGORY } from "../../../types";
import { selectSearch, selectFilter } from "../../../selectors/search";

interface StateProps {
  filter: Filter;
}

interface DispatchProps {
  updateFilter: typeof updateFilter;
}

type Props = DispatchProps & ContentRendererArgs & StateProps;

const FilterPopover = (props: Props) => {
  const toggleType = (newType: SEARCH_CATEGORY) => {
    if (props.filter.types.includes(newType))
      props.updateFilter({
        types: props.filter.types.filter(type => type !== newType)
      });
    else props.updateFilter({ types: [...props.filter.types, newType] });
  };

  return (
    <ArrowContainer // if you'd like an arrow, you can import the ArrowContainer!
      position={props.position}
      targetRect={props.targetRect}
      popoverRect={props.popoverRect}
      arrowColor={blueTitleBar}
      arrowSize={10}
      arrowStyle={{ opacity: 0.9 }}
    >
      <div
        style={{
          backgroundColor: blueTitleBar,
          opacity: 0.9,
          color: "white",
          padding: 20
        }}
      >
        <div style={{ display: "flex", flexDirection: "row " }}>
          <div>Artist</div>
          <input
            name="artist"
            type="checkbox"
            checked={props.filter.types.indexOf("artist") !== -1}
            onChange={() => toggleType("artist")}
          />
        </div>
        <div style={{ display: "flex", flexDirection: "row " }}>
          <div>Album</div>
          <input
            name="album"
            type="checkbox"
            checked={props.filter.types.indexOf("album") !== -1}
            onChange={() => toggleType("album")}
          />
        </div>

        <div style={{ display: "flex", flexDirection: "row " }}>
          <div>Track</div>
          <input
            name="track"
            type="checkbox"
            checked={props.filter.types.indexOf("track") !== -1}
            onChange={() => toggleType("track")}
          />
        </div>
        <Separator
          color={"white"}
          style={{ marginTop: 10, marginBottom: 10 }}
        />
        <div>Rock</div>
        <div>Reggae</div>
        <div>Metal</div>
        <div>Electro</div>
      </div>
    </ArrowContainer>
  );
};

const mapStateToProps = (state: AppState) => ({
  filter: selectFilter(state)
});

const mapDispatchToProps = (dispatch: ThunkDispatch<AppState, null, Action>) =>
  bindActionCreators({ updateFilter }, dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FilterPopover);
