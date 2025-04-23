import styled from 'styled-components';

export const SignupSection = styled.section`
  padding: 60px 30px;
  background-color: #f5f7fa;
  max-width: 1200px;
  margin: auto;
  width: 100%;

  @media (max-width: 768px) {
    padding: 40px 20px;
  }
`;

export const Form = styled.form`
  width: 90%;
  max-width: 500px;
  margin: auto;
  display: flex;
  flex-direction: column;
  gap: 1rem;

  @media (max-width: 480px) {
    width: 100%;
  }
`;

const sharedInputStyles = `
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 1rem;
  transition: border-color 0.3s ease;

  &:focus {
    outline: none;
    border-color: rgb(15, 110, 173);
    box-shadow: 0 0 0 2px rgba(15, 110, 173, 0.1);
  }
`;

export const Input = styled.input`
  ${sharedInputStyles}
`;

export const Select = styled.select`
  ${sharedInputStyles}
  background-color: #fff;
`;

export const Button = styled.button`
  padding: 12px;
  background-color: rgb(15, 110, 173);
  color: white;
  border: none;
  border-radius: 5px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background-color: rgb(49, 137, 196);
    transform: translateY(-2px);
  }

  &:active {
    transform: translateY(0);
  }
`;
