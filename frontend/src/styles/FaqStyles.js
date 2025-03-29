import styled from 'styled-components';

export const FaqTitle = styled.h2`
  color: rgb(0, 1, 1);
  margin-bottom: 30px;
  writing-mode: vertical-lr;
  transform: rotate(180deg);
  position: absolute;
  left: -27px;
  font-size: 2em;
  padding: 20px 0;
  border-right: 4px solid rgb(15, 110, 173);
  border-left: none;

  @media (max-width: 768px) {
    position: static;
    writing-mode: horizontal-tb;
    transform: none;
    border: none;
    text-align: center;
    margin: 10px 0;
  }
`;

export const FaqContainer = styled.div`
  max-width: 1000px;
  margin: 40px auto;
  padding: 20px 20px 20px 100px;
  position: relative;
  background-color: #f5f5f5;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

  @media (max-width: 768px) {
    padding: 20px;
  }
`;

export const FaqContent = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
`;

export const FaqColumn = styled.div`
  flex: 1;
  min-width: 300px;

  @media (max-width: 768px) {
    flex: 100%;
  }
`;

export const FaqItem = styled.div`
  margin-bottom: 15px;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
`;

export const Question = styled.div`
  padding: 15px 20px;
  background-color: rgb(15, 110, 173);
  color: white;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: rgb(49, 137, 196);
  }
`;

export const Answer = styled.div`
  padding: ${props => props.isOpen ? '15px 20px' : '0 20px'};
  background-color: white;
  max-height: ${props => props.isOpen ? '500px' : '0'};
  overflow: hidden;
  transition: all 0.3s ease;
`;
