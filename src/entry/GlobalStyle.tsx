import { createGlobalStyle } from "styled-components";

export const GlobalStyle = createGlobalStyle`
    html {
        font-size: ${(props) => props.theme.font};
        font-family: ${(props) => props.theme.fontFamily};
        color: ${(props) => props.theme.contentColor};
        line-height: ${(props) => props.theme.lineHeight};
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
    div,span{
        box-sizing: border-box;
    }
`;
