// import original module declarations
import "styled-components";
import { ThemeState } from "./js/reducers/theme";

// and extend them!
declare module "styled-components" {
  export interface DefaultTheme extends ThemeState {}
}
