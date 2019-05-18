// this comment tells babel to convert jsx to calls to a function called jsx instead of React.createElement
/** @jsx jsx */

import { css, jsx, keyframes } from "@emotion/core";
import { ChangeEvent, useState } from "react";
import { FaAccusoft, FaSearch } from "react-icons/fa";
import { GiSettingsKnobs } from "react-icons/gi";
import Popover, { ArrowContainer } from "react-tiny-popover";

import { blueTitleBar } from "../../../styles/colors";
import FilterIcon from "../Icons/FilterIcon";
import FilterPopover from "../FilterPopover";

interface Props {
  onChange: (text: string, e: ChangeEvent<HTMLInputElement>) => void;
}

const fadeOut = keyframes`0% { opacity: 1; } 100% { opacity: 0; }`;
const fadeIn = keyframes`0% { opacity: 0; } 100% { opacity: 1; }`;

const SearchInput = (props: Props) => {
  let trigger = null;
  const [query, setQuery] = useState("");
  const [fadeAnim, setFadeAnim] = useState(
    css`
      animation: none;
    `
  );
  const [filterEnabled, setFilter] = useState(false);
  const [isMenuOpen, toggleMenu] = useState(false);

  return (
    <div style={{ position: "relative" }}>
      <FaSearch
        size={14}
        color={"grey"}
        css={css`
          position: absolute;
          top: 4px;
          left: 5px;
          ${fadeAnim}
        `}
      />
      <Popover
        isOpen={isMenuOpen}
        position={"bottom"}
        content={props => <FilterPopover {...props} />}
        containerStyle={{ "z-index": 9999 }}
        onClickOutside={() => toggleMenu(false)} // handle
      >
        <GiSettingsKnobs
          onClick={() => toggleMenu(!isMenuOpen)}
          color={"black"}
          size={16}
          css={css`
            position: absolute;
            right: 6px;
            top: 4px;
            width: 14px;
            height: 14px;
            color: red;
          `}
        />
      </Popover>
      <input
        css={css`
          border: 1px solid transparent;
          padding: 3px 24px 3px 22px;
          border-radius: 999em;
          transition: border 0.4s, padding-left 0.3s;
          &:hover {
            border: 1px solid rgba(0, 85, 229, 0.4);
          }
          &:focus {
            outline: none;
            padding-left: 10px;
          }
        `}
        onFocus={() =>
          setFadeAnim(
            css`
              animation: ${fadeOut} 0.2s ease-out forwards;
            `
          )
        }
        onBlur={() =>
          setFadeAnim(
            css`
              animation: ${fadeIn} 0.2s ease-out forwards;
            `
          )
        }
        placeholder="Search"
        type="text"
        value={query}
        onChange={e => {
          setQuery(e.target.value);
          props.onChange(e.target.value, e);
        }}
      />
    </div>
  );
};

export default SearchInput;
