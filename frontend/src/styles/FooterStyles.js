import styled from 'styled-components';

// Conteneur principal de la page
export const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`;

// Contenu principal de la page
export const Content = styled.main`
  flex: 1;
  padding: 20px;

  @media (max-width: 480px) {
    padding: 15px 10px;
  }
`;

// Footer
export const FooterContainer = styled.footer`
  background-color: whitesmoke;
  width: 100%;
  position: relative;
  border-top: solid rgb(15, 110, 173) 3px;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 15px;
  padding: 20px 10px;
  text-align: center;
  margin-top: auto;

  @media (max-width: 480px) {
    padding: 15px 5px;
  }
`;

export const Names = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
  font-size: 0.9rem;
  align-items: center;

  a {
    text-decoration: none;
    color: rgb(15, 110, 173);
    font-weight: 600;
    transition: transform 0.3s ease;

    &:hover {
      color: rgb(49, 137, 196);
      transform: scale(1.1);
      cursor: pointer;
    }
  }

  @media (max-width: 768px) {
    width: 100%;
  }
`;

export const About = styled.div`
  max-width: 600px;
  color: rgb(15, 110, 173);

  h6 {
    text-transform: uppercase;
    margin-bottom: 10px;
    font-size: 0.8rem;
    color: rgb(15, 110, 173);
    transition: transform 0.3s ease;

    &:hover {
      color: rgb(49, 137, 196);
      transform: scale(1.1);
      cursor: pointer;
    }
  }

  p {
    font-size: 0.9rem;
  }

  @media (max-width: 768px) {
    text-align: center;
    margin: 10px 0;
  }
`;

export const Logo = styled.img`
  height: 7vh;
  transition: transform 0.3s ease;
  margin: 10px;

  &:hover {
    transform: scale(1.1);
  }

  @media (max-width: 768px) {
    height: 6vh;
  }

  @media (max-width: 480px) {
    height: 5vh;
  }
`;
