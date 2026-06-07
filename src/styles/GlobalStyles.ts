import { createGlobalStyle } from 'styled-components';
import { theme } from './theme';

export const GlobalStyles = createGlobalStyle`
  *, *::before, *::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  html, body, #root {
    width: 100%;
    height: 100%;
    overflow: hidden;
    font-family: ${theme.font.sans};
    font-size: ${theme.font.size.md};
    color: ${theme.colors.text};
    background: ${theme.colors.bg};
    -webkit-font-smoothing: antialiased;
  }

  button {
    cursor: pointer;
    border: none;
    background: none;
    font: inherit;
    color: inherit;
  }

  input, textarea {
    font: inherit;
    color: inherit;
  }

  a {
    color: inherit;
    text-decoration: none;
  }

  ::-webkit-scrollbar {
    width: 6px;
    height: 6px;
  }

  ::-webkit-scrollbar-track {
    background: transparent;
  }

  ::-webkit-scrollbar-thumb {
    background: rgba(255,255,255,0.15);
    border-radius: 3px;
  }
`;
