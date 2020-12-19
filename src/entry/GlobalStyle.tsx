import { createGlobalStyle } from "styled-components";

export const GlobalStyle = createGlobalStyle`
    html {
        font-size: ${(props) => props.theme.largeFont};
        font-family: "Helvetica Neue",Helvetica,Arial,"PingFang SC","Hiragino Sans GB","Heiti SC","Microsoft YaHei","WenQuanYi Micro Hei",sans-serif;
    }
    body,html { 
        margin: 0;
        padding: 0,
    }
    #root {
        height: 100vh;
        overflow: hidden;
        box-sizing: border-box;
    }
`;
