// this comment tells babel to convert jsx to calls to a function called jsx instead of React.createElement
/** @jsx jsx */
import { css, jsx } from "@emotion/core";
import { FaSearch } from "react-icons/fa";

const SearchInput = () => {
  return (
    <div style={{ position: "relative" }}>
      <FaSearch
        size={14}
        color={"grey"}
        style={{ position: "absolute", top: 4, left: 5 }}
      />
      <input
        css={css`
          border: 1px solid transparent;
          padding: 3px 8px 3px 22px;
          border-radius: 999em;
          transition: border 0.4s;
          &:hover {
            border: 1px solid rgba(0, 85, 229, 0.4);
          }
          &:focus {
            outline: none;
            border: 1px solid rgba(0, 85, 229, 1);
          }
        `}
        // onFocus={{}}
        placeholder="Search"
        type="text"
        value={""}
        onChange={e => {
          console.log("todo");
          /* this.setState({ query: e.target.value });
        if (e.target.value !== "") this.startSearch(); */
        }}
      />
    </div>
  );
};

export default SearchInput;
