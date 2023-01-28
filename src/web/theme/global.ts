import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
    body {
        margin: 0;
        padding: 0;
        overflow-x: hidden;
        background-color: transparent;
        transition: all ease-in-out 0.1s;
    }
    html {
        scroll-behavior: smooth;
    }
    * {
        scrollbar-width: thin;
        scrollbar-color: gray white;
    }
    *::-webkit-scrollbar {
        width: 7px;
        height: 7px;
    }
    *::-webkit-scrollbar-track {
        background-color: transparent;
    }
    *::-webkit-scrollbar-thumb {
        border: 2px solid transparent;
        background-clip: padding-box;
        border-radius: 9999px;
        background-color: gray;
    }
`;

export default GlobalStyle;
