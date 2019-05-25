// this comment tells babel to convert jsx to calls to a function called jsx instead of React.createElement
/** @jsx jsx */

import { css, jsx, keyframes } from "@emotion/core";
import { ChangeEvent, useState } from "react";
import { FaSearch } from "react-icons/fa";
import { GiSettingsKnobs } from "react-icons/gi";
import Popover from "react-tiny-popover";

import { blueTitleBar } from "../../../styles/colors";
import FilterPopover from "../FilterPopover";

interface OwnProps {
  onChange: (text: string, e: ChangeEvent<HTMLInputElement>) => void;
  id: string;
}

type Props = OwnProps;
const fadeOut = keyframes`0% { opacity: 1; } 100% { opacity: 0; }`;
const fadeIn = keyframes`0% { opacity: 0; } 100% { opacity: 1; }`;

const SearchInput = (props: Props) => {
  const [query, setQuery] = useState("");
  const [isFilterOpen, toggleFilter] = useState(false);
  const [fadeAnim, setFadeAnim] = useState(
    css`
      animation: none;
    `
  );

  return (
    <div key={props.id} style={{ position: "relative" }}>
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
        key={props.id}
        isOpen={isFilterOpen}
        position={"right"}
        windowBorderPadding={5}
        content={(popoverProps: any) => <FilterPopover {...popoverProps} />}
        containerStyle={{
          overflow: "unset",
          minWidth: "200px",
          zIndex: 9999,
          boxShadow:
            "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)"
        }}
        onClickOutside={(e: React.MouseEvent<HTMLDivElement>) => {
          if (e.path.some(node => node.id === "filter-popover")) return;
          else toggleFilter(!isFilterOpen);
        }} // handle
      >
        <GiSettingsKnobs
          key={props.id}
          onClick={() => toggleFilter(!isFilterOpen)}
          color={props.isFilterOpen ? blueTitleBar : "black"}
          size={16}
          css={css`
            position: absolute;
            right: 6px;
            top: 4px;
            width: 14px;
            height: 14px;
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
