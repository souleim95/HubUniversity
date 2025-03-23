import styled from 'styled-components';

export const SignupSection = styled.section`
  padding: 60px 30px;
  background-color: #f5f7fa;
`;

export const Form = styled.form`
  max-width: 500px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

export const Input = styled.input`
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 1rem;
`;

export const Select = styled.select`
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 1rem;
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
`;