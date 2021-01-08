import "styled-components";

declare module "styled-components" {
  export interface DefaultTheme {
    smallFont: string;
    font: string;
    largeFont: string;
    padding: string;
    margin: string;
    primaryColor: string;
    buttonActive: string;
  }
}
