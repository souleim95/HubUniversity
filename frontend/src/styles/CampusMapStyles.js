import styled from 'styled-components';

export const MapSection = styled.section`
  padding: 4rem 2rem;
  background-color: white;
  max-width: 1200px;
  margin: auto;
  width: 100%;
`;

export const MapContainer = styled.div`
  height: 400px;
  margin: 2rem 0;
  border-radius: 10px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);

  @media (max-width: 768px) {
    height: 250px;
  }
`;

export const EventsList = styled.div`
  margin-top: 2rem;
  padding: 0 10px;
`;
