import "styled-components";

declare module "styled-components" {
  export interface DefaultTheme {
    smallFont: string;
    font: string;
    largeFont: string;
    padding: string;
    fontFamily: string;
    margin: string;
    primaryColor: string;
    buttonActiveColor: string;
    backgroundColor: string;
    white: string;
    black: string;
    gridStrokeColor: string;
    triangleFillColor: string;
    contentColor: string;
  }
}
