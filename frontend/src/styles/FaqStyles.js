import styled from 'styled-components';

export const FaqContainer = styled.div`
  margin: 40px auto;
  padding: 2rem;
  max-width: 1400px;
  width: 102.5%;
  background: white;
  border-radius: 24px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  align-items: center;
  transition: transform 0.3s ease;

  &:hover {
    transform: scale(1.01);
    box-shadow: 0 6px 30px rgba(0, 0, 0, 0.15);
  }
`;

export const FaqTitle = styled.div`
  background: #f8fafc;
  border-radius: 16px;
  padding: 1.5rem;
  margin-bottom: 2rem;
  text-align: center;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  width: 100%;

  h2 {
    color: #1a202c;
    font-size: 2.5em;
    font-weight: 600;
    margin: 0;
    letter-spacing: -0.02em;
  }
`;

export const FaqContent = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 2rem;
  width: 100%;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

export const FaqColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

export const FaqItem = styled.div`
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  background: white;
  border: 1px solid #eef2f7;
  transition: all 0.3s ease;

  &:hover {
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
    transform: translateY(-2px);
  }
`;

export const Question = styled.div`
  padding: 1rem 1.5rem;
  background: ${props => props.isOpen ? 'rgb(15, 110, 173)' : '#f8fafc'};
  color: ${props => props.isOpen ? 'white' : '#1a202c'};
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: 500;
  font-size: 1rem;
  transition: all 0.3s ease;

  &:hover {
    background: ${props => props.isOpen ? 'rgb(12, 90, 143)' : '#f1f5f9'};
  }
`;

export const Answer = styled.div`
  padding: ${props => props.isOpen ? '1.5rem' : '0'};
  background: white;
  max-height: ${props => props.isOpen ? '500px' : '0'};
  opacity: ${props => props.isOpen ? '1' : '0'};
  overflow: hidden;
  transition: all 0.3s ease;
  line-height: 1.6;
  color: #4a5568;
  font-size: 0.95rem;
`;
