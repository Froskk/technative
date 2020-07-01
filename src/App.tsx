import React from "react";
import styled from "styled-components";
import { ThemeProvider } from "styled-components";

import { GlobalStyles } from "globalStyles";
import { theme } from "theme";

import { Breakdown } from "features/breakdown/breakdown";

const Main = styled.main`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translateX(-50%) translateY(-50%);
`;

const App = () => (
  <ThemeProvider theme={theme}>
    <GlobalStyles />
    <Main>
      <header>
        <h1>Fight for the top - Breakdown</h1>
      </header>
      <Breakdown />
    </Main>
  </ThemeProvider>
);

export default App;
