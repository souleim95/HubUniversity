import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600&display=swap');
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600&display=swap');

  :root {
    --primary-color: ${props => props.theme.colors?.primary || '#0f6ead'};
    --secondary-color: ${props => props.theme.colors?.secondary || '#2b6cb0'};
    --font-family: ${props => props.theme.customization?.fontFamily || 'Arial, sans-serif'};
    --border-radius: ${props => props.theme.customization?.borderRadius || '8px'};
    --header-height: ${props => props.theme.layout?.headerStyle === 'fixed' ? '80px' : 'auto'};
    --container-width: ${props => props.theme.layout?.containerWidth === 'wide' ? '1400px' : '1200px'};
    --toast-position: ${props => props.theme.notifications?.position || 'top-right'};
    --font-primary: 'Poppins', sans-serif;
    --font-secondary: 'Playfair Display', serif;
    --background-color: ${props => props.theme.theme === 'dark' ? '#1a1a1a' : '#f8f9fa'};
    --text-color: '#f8f9fa';
    --border-color: ${props => props.theme.theme === 'dark' ? '#404040' : '#e0e0e0'};
    --card-bg: ${props => props.theme.theme === 'dark' ? '#2d2d2d' : '#ffffff'};
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
    transition: ${props => props.theme.customization?.animations ? 'all 0.3s ease-in-out' : 'none'};
  }

  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    transition: background-color 0.3s ease, color 0.3s ease;
  }

  body {
    padding-top: 6vh;
    margin: 0;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    background-color: var(--background-color);
    color: var(--text-color);
    overflow-x: hidden;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    line-height: 1.6;
    font-family: var(--font-family);
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
    font-family: var(--font-family);
    background-color: var(--primary-color);
    color: white;
    border: none;
    border-radius: 4px;
    padding: 8px 16px;
    cursor: pointer;
    
    &:hover {
      background-color: var(--secondary-color);
    }

    &.secondary {
      background-color: transparent;
      border: 1px solid var(--primary-color);
      color: var(--primary-color);

      &:hover {
        background-color: var(--primary-color);
        color: white;
      }
    }
  }

  input, select, textarea {
    font-family: inherit;
    font-size: inherit;
    font-family: var(--font-family);
    background-color: var(--card-bg);
    border: 1px solid var(--border-color);
    color: var(--text-color);
    border-radius: 4px;
    padding: 8px;

    &:focus {
      border-color: var(--primary-color);
      outline: none;
      box-shadow: 0 0 0 2px rgba(var(--primary-color), 0.2);
    }
  }

  ul {
    list-style: none;
    padding-left: 0;
  }

  .toast-container {
    --toastify-font-family: var(--font-family);
  }

  .toast {
    border-radius: var(--border-radius);
  }

  // Styles de base des cartes
  .card {
    background-color: var(--card-bg);
    border: 1px solid var(--border-color);
    border-radius: 8px;
  }
`;

export default GlobalStyle;
