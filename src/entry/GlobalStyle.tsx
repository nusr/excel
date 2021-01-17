import { createGlobalStyle } from "styled-components";

export const GlobalStyle = createGlobalStyle`
    html {
        font-size: ${(props) => props.theme.font};
        font-family: ${(props) => props.theme.fontFamily};
        color: ${(props) => props.theme.contentColor};
    }
    body,html { 
        margin: 0;
        padding: 0;
    }
    #root {
        height: 100vh;
        overflow: hidden;
        box-sizing: border-box;
    }
`;
