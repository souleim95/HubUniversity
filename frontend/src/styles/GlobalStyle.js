import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600&display=swap');
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600&display=swap');

  :root {
    --font-primary: 'Poppins', sans-serif;
    --font-secondary: 'Playfair Display', serif;
    --primary-color: #4f46e5; /* Couleur principale (bleu) */
    --secondary-color: #6b7280; /* Gris pour les textes secondaires */
    --background-color: #f3f4f6; /* Couleur de fond */
  }

  * {
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
`;

export default GlobalStyle;
