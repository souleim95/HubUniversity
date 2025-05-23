import styled from 'styled-components';
export const FormationContainer = styled.div`
  padding: 2rem;
  max-width: 1200px;
    padding-top: 120px;
  margin: 0 auto;
  min-height: 100vh;
  background-color: #f8f9fa;

  @media (max-width: 480px) {
    padding: 1rem;
  }
`;

export const FormationHeader = styled.div`
  text-align: center;
  margin-bottom: 3rem;

  h1 {
    color: #2c3e50;
    margin-bottom: 1.5rem;
    font-size: 2.5rem;
    font-weight: bold;

    @media (max-width: 480px) {
      font-size: 1.8rem;
    }
  }
`;

export const TabContainer = styled.div`
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 2rem;
`;

export const Tab = styled.button`
  padding: 0.8rem 1.5rem;
  border: none;
  border-radius: 5px;
  background: ${props => props.active ? '#3498db' : '#ecf0f1'};
  color: ${props => props.active ? 'white' : '#2c3e50'};
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: ${props => props.active ? '#2980b9' : '#bdc3c7'};
  }

  @media (max-width: 480px) {
    padding: 0.6rem 1.2rem;
    font-size: 0.9rem;
  }
`;

export const FormationCard = styled.div`
  background: white;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: transform 0.3s ease;
  min-height: 300px;
  display: flex;
  flex-direction: column;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
  }

  @media (max-width: 480px) {
    min-height: auto;
  }
`;

export const FormationType = styled.div`
  background: #3498db;
  color: white;
  padding: 1rem;
  font-size: 1.2rem;
  font-weight: bold;
  text-align: center;

  @media (max-width: 480px) {
    font-size: 1rem;
    padding: 0.8rem;
  }
`;

export const FormationDetails = styled.div`
  padding: 1.5rem;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  gap: 1rem;

  p {
    color: #555;
    line-height: 1.6;
    font-size: 1.1rem;

    @media (max-width: 480px) {
      font-size: 1rem;
    }
  }

  h4 {
    color: #2c3e50;
    margin: 1rem 0;
    font-size: 1.2rem;

    @media (max-width: 480px) {
      font-size: 1.05rem;
    }
  }

  ul {
    list-style-type: none;
    padding-left: 0;

    li {
      color: #666;
      padding: 0.5rem 0;
      font-size: 1rem;

      &:before {
        content: "•";
        color: #3498db;
        font-weight: bold;
        margin-right: 0.8rem;
      }

      @media (max-width: 480px) {
        font-size: 0.95rem;
      }
    }
  }

  a {
    color: #3498db;
    text-decoration: none;
    font-weight: bold;

    &:hover {
      text-decoration: underline;
    }
  }

`;

export const FormationGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;

  @media (max-width: 480px) {
    gap: 1rem;
  }
`;
