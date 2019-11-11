// this comment tells babel to convert jsx to calls to a function called jsx instead of React.createElement
/** @jsx jsx */
import { jsx } from "@emotion/core";
import { connect } from "react-redux";
import Select from "react-select";
import { ValueType } from "react-select/lib/types";
import { ContentRendererArgs } from "react-tiny-popover";
import { Action, bindActionCreators } from "redux";
import { ThunkDispatch } from "redux-thunk";
import { Filter, updateFilter } from "../../../actions/search-pagination";
import { AppState } from "../../../reducers";
import { selectFilter } from "../../../selectors/search";
import { blueTitleBar } from "../../../styles/colors";
import { SEARCH_CATEGORY } from "../../../types";

interface StateProps {
  filter: Filter;
}

interface DispatchProps {
  updateFilter: typeof updateFilter;
}

type Props = DispatchProps & ContentRendererArgs & StateProps;
const options = [
  { value: "artist", label: "Artists" },
  { value: "album", label: "Albums" },
  { value: "track", label: "Tracks" }
];

const FilterPopover = (props: Props) => {
  return (
    <div
      id="filter-popover" // Required for onClickOutside
      style={{
        backgroundColor: "white",
        padding: 17,
        borderRadius: 3,
        minWidth: 200
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between"
        }}
      >
        <Select
          openMenuOnFocus
          onChange={(
            e: ValueType<{
              value: string;
              label: string;
            }>
          ) => props.updateFilter({ types: e.map((val: any) => val.value) })}
          closeMenuOnSelect={false}
          defaultValue={options.filter(option =>
            props.filter.types.includes(option.value)
          )}
          placeholder={"Type..."}
          isMulti
          styles={{
            control: style => ({
              ...style,
              minWidth: 200
            }),
            option: (styles, { data, isDisabled, isFocused, isSelected }) => ({
              ...styles,
              color: isFocused ? "white" : "black"
            })
          }}
          theme={theme => {
            return {
              ...theme,
              borderRadius: 4,
              colors: {
                ...theme.colors,
                primary25: blueTitleBar
              }
            };
          }}
          options={options}
        />
      </div>
    </div>
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
