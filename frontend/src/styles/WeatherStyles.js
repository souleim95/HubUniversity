import styled from 'styled-components';

export const WeatherContainer = styled.div`
  padding: 20px;
  margin: 0 auto 20px auto;
  max-width: 450px;
  width: 100%;
  background-color: #ffffff;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    cursor: pointer;
  }

  @media (max-width: 480px) {
    padding: 15px;
  }
`;

export const WeatherDetails = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;

  @media (max-width: 480px) {
    flex-direction: column;
  }
`;

export const WeatherTitle = styled.h2`
  color: #2b6cb0;
  font-size: 1.75em;
  font-weight: 600;
  text-align: center;
  margin-bottom: 15px;
  letter-spacing: -0.5px;
  text-transform: capitalize;
`;

export const WeatherIcon = styled.img`
  width: 80px;
  height: 80px;
  margin-right: 20px;
  transition: transform 0.3s ease;

  &:hover {
    transform: scale(1.1);
    cursor: pointer;
  }
`;

export const WeatherDescription = styled.p`
  margin: 0;
  font-size: 1.2em;
  font-weight: 400;
  color: #555;
  text-transform: capitalize;
`;

export const WeatherTemp = styled.p`
  margin: 5px 0 0 0;
  font-size: 1.4em;
  font-weight: 700;
  color: #333;
  letter-spacing: 0.5px;
`;

export const WeatherError = styled.div`
  color: #e53e3e;
  font-size: 1.1em;
  text-align: center;
  margin-bottom: 15px;
  font-weight: 600;
`;

export const WeatherLoading = styled.div`
  font-style: italic;
  text-align: center;
  color: #999;
  font-size: 1.1em;
`;

export const ForecastContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 25px;
  gap: 15px;
  overflow-x: auto;
  padding-bottom: 10px;

  &::-webkit-scrollbar {
    height: 8px;
  }

  &::-webkit-scrollbar-track {
    background: #f5f5f5;
  }

  &::-webkit-scrollbar-thumb {
    background: #ccc;
    border-radius: 8px;
  }
`;

export const ForecastDay = styled.div`
  text-align: center;
  background-color: #f7fafc;
  padding: 15px;
  border-radius: 12px;
  min-width: 110px;
  flex-shrink: 0;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
    cursor: pointer;
  }
`;

export const ForecastTemp = styled.div`
  font-size: 1.3em;
  color: #333;
  font-weight: 700;
  margin-top: 10px;
`;

export const ForecastDate = styled.div`
  font-size: 1.05em;
  color: #666;
  margin-bottom: 12px;
  font-weight: 500;
  text-transform: capitalize;
`;
