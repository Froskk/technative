import { createGlobalStyle } from "styled-components";

export const GlobalStyles = createGlobalStyle`
  *, *:before, *:after {
    box-sizing: border-box;
    text-rendering: optimizeLegibility;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    padding: 0;
    margin: 0;
  }

  body {
    font-family: 'Beaufort', sans-serif, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    font-size: ${(props) => props.theme.font.medium};
    background: ${(props) => props.theme.color.dark};
    color: ${(props) => props.theme.color.accent};
  }

  code {
    font-family: source-code-pro, Menlo, Monaco, Consolas, "Courier New",
    monospace;
  }


  img {
    height: auto;
    max-width: 100%;
    margin-left: auto;
    margin-right: auto;
    display: block;
  }
`;
