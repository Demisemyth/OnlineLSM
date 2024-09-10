// GlobalStyle.js
import { createGlobalStyle } from 'styled-components';
import { theme } from './theme';

export const GlobalStyle = createGlobalStyle`
  body {
    background-color: ${theme.backgroundColor};
    color: ${theme.textColor};
    font-family: Arial, sans-serif;
    margin: 0;
    padding: 0;
  }

  a {
    color: ${theme.secondaryColor};
    text-decoration: none;
  }

  a:hover {
    text-decoration: underline;
  }
`;
