import React, { ElementType } from "react";
import { ThemeContext } from "..";
import store from "../store";
import { selectTheme } from "../styles/themes";
import { connect } from "react-redux";
import { AppState } from "../reducers";

export function withTheme(WrappedComponent: ElementType) {
  const withPropsWrapped = class extends React.Component<any> {
    render() {
      return (
        <WrappedComponent
          theme={selectTheme(this.props._themeState)}
          {...this.props}
        />
      );
    }
  };

  const mapStateToProps = (state: AppState) => ({
    _themeState: state.settings.theme
  });

  return connect(mapStateToProps)(withPropsWrapped);
}
