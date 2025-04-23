import styled from 'styled-components';

const Button = styled.button`
  background-color: rgb(15, 110, 173);
  color: white;
  border: none;
  border-radius: 8px;
  padding: 10px 20px;
  cursor: pointer;
  font-size: 1rem;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: rgb(12, 90, 140);
  }

  @media (max-width: 480px) {
  width: 100%;
  text-align: center;
}

`;


export default Button;
