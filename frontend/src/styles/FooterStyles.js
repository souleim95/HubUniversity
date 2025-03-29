import styled from 'styled-components';

export const FooterContainer = styled.footer`
  background-color: whitesmoke;
  width: 100%;
  position: relative;
  border-top: solid rgb(15, 110, 173) 3px;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 20px;
  padding: 20px;
  text-align: center;
`;

export const Names = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  font-size: 1rem;
  align-items: center;

  a {
    text-decoration: none;
    color: rgb(15, 110, 173);
    font-weight: 600;
    transition: transform 0.3s ease;

    &:hover {
      color: rgb(49, 137, 196);
      transform: scale(1.1);
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
    font-weight: bold;
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
`;
