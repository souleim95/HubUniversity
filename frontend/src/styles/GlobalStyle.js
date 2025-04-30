import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600&display=swap');
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600&display=swap');

  :root {
    --secondary-color: ${props => props.theme.colors?.secondary || '#1f2937'};
    --font-family: ${props => props.theme.customization?.fontFamily || 'Arial, sans-serif'};
    --border-radius: ${props => props.theme.customization?.borderRadius || '8px'};
    --header-height: ${props => props.theme.layout?.headerStyle === 'fixed' ? '80px' : 'auto'};
    --container-width: ${props => props.theme.layout?.containerWidth === 'wide' ? '1400px' : '1200px'};
    --font-primary: 'Poppins', sans-serif;
    --font-secondary: 'Playfair Display', serif;
    --background-color: ${props => props.theme.theme === 'dark' ? '#1a1a1a' : '#f8f9fa'};
    --text-color: ${props => props.theme.colors?.secondary || '#1f2937'};
    --border-color: #ffffff';
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

  h1, h2, h3, h4, h5, h6 {
    font-family: var(--font-secondary);
    color: var(--secondary-color);
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
    color: var(--primary-color);
    text-decoration: none;
    transition: color 0.3s ease;
    
    &:hover {
      color: var(--secondary-color);
    }
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

    &.primary {
      background-color: var(--primary-color);
      color: white;
      
      &:hover {
        background-color: var(--secondary-color);
      }
    }
    
    &.secondary {
      background-color: var(--secondary-color);
      color: white;
      
      &:hover {
        opacity: 0.9;
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

  p, span, label, input, select, textarea {
    color: var(--secondary-color);
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

  // Style pour les éléments de navigation
  nav {
    a, button {
      color: var(--primary-color);
      
      &:hover, &.active {
        color: var(--secondary-color);
      }
    }
  }

  // Style pour les liens et boutons d'action
  .action-link, .action-button {
    color: var(--primary-color);
    
    &:hover {
      color: var(--secondary-color);
    }
  }

  // Style pour les titres de section
  .section-title {
    color: var(--secondary-color);
    border-bottom: 2px solid var(--primary-color);
  }
`;

export default GlobalStyle;
