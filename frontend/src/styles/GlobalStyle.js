import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600&display=swap');
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600&display=swap');

  :root {
    --font-primary: 'Poppins', sans-serif;
    --font-secondary: 'Playfair Display', serif;
    --primary-color: #4f46e5;
    --secondary-color: #6b7280;
    --background-color: #f3f4f6;
  }

  html {
    font-size: 100%;
    scroll-behavior: smooth;
  }

  @media (max-width: 768px) {
    html {
      font-size: 93%;
    }
  }

  @media (max-width: 480px) {
    html {
      font-size: 87.5%;
    }
  }

  *, *::before, *::after {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: var(--font-primary);
  }

  body {
    padding-top: 6vh;
    margin: 0;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    background-color: var(--background-color);
    overflow-x: hidden;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    line-height: 1.6;
  }

  main {
    flex: 1;
    width: 100%;
  }

  h1, h2, h3 {
    font-family: var(--font-secondary);
  }

  .App {
    transition: all 0.3s ease;
  }

  img {
    max-width: 100%;
    height: auto;
    display: block;
  }

  a {
    color: inherit;
    text-decoration: none;
  }

  button {
    font-family: inherit;
    font-size: inherit;
    border: none;
    background: none;
    cursor: pointer;
  }

  input, select, textarea {
    font-family: inherit;
    font-size: inherit;
  }

  ul {
    list-style: none;
    padding-left: 0;
  }
`;

export default GlobalStyle;
