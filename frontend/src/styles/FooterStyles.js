import styled from 'styled-components';

export const FooterContainer = styled.footer`
  background-color: whitesmoke;
  width: 101%;
  margin: -1%;
  position: relative;
  border-top: solid rgb(15, 110, 173) 3px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  text-align: center;
  padding: 1vh 0;
`;

export const Names = styled.div`
  display: flex;
  flex-direction: column;
  width: 8vw;
  height: fit-content;
  gap: 0.25vh;
  font-size: 1vw;
  margin-top: 0.2vh;
  position: left;
  left: 30.7%;
  border-right: solid rgb(15, 110, 173) 3px;
  padding-right: 0.85%;
  margin-left: 2vw;

  a {
    text-decoration: none;
    color: rgb(15, 110, 173);
    font-size: 0.8vw;
    cursor: pointer;
    font-weight: 600;
    background-color: whitesmoke;
    transition: transform 0.3s ease;
    border: none;
    left: 1vw;
    position: relative;
    width: fit-content;

    &:hover {
      color: rgb(49, 137, 196);
      transform: scale(1.1);
    }
  }
`;

export const About = styled.div`
  position: absolute;
  width: 66vw;
  height: 6.8vh;
  margin-left: 12vw;
  top: 0.4vh;

  h6 {
    cursor: pointer;
    font-size: 0.8vw;
    position: absolute;
    bottom: 0.3vh;
    left: 0.2vw;
    color: rgb(15, 110, 173);
    text-transform: uppercase;
    transition: transform 0.3s ease;

    &:hover {
      color: rgb(49, 137, 196);
      transform: scale(1.1);
    }
  }

  p {
    font-size: 85%;
    position: absolute;
    top: 0.8vw;
    color: rgb(15, 110, 173);
  }
`;

export const Logo = styled.img`
  height: ${props => props.type === 'cytech' ? '8.1vh' : '7.5vh'};
  margin-top: ${props => props.type === 'cytech' ? '0.3vw' : '0.4vw'};
  margin-left: ${props => props.type === 'cytech' ? '67vw' : '0'};
  margin-right: ${props => props.type === 'cyu' ? '1.5vw' : '0'};
  transition: transform 0.3s ease;

  &:hover {
    transform: scale(1.1);
  }
`; 