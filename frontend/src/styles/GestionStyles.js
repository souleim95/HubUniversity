export const ObjectItem = styled.div`
  display: flex;
  flex-direction: column;
  padding: 20px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  }

  @media (max-width: 480px) {
    padding: 15px;
  }
`;

export const ObjectHeader = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 15px;
  flex-wrap: wrap;

  @media (max-width: 480px) {
    justify-content: center;
    text-align: center;
    gap: 10px;
    word-break: break-word;
overflow-wrap: break-word;

  }
`;

export const ObjectControls = styled.div`
  margin-top: 15px;
  padding-top: 15px;
  border-top: 1px solid #eee;
  display: flex;
  flex-wrap: wrap;
  gap: 10px;

  @media (max-width: 480px) {
    flex-direction: column;
    align-items: stretch;
    word-break: break-word;
overflow-wrap: break-word;

  }
`;

export const ControlButton = styled.button`
  padding: 8px 15px;
  margin: 5px;
  border: none;
  border-radius: 5px;
  background: ${props => props.active ? '#4CAF50' : '#f0f0f0'};
  color: ${props => props.active ? 'white' : 'black'};
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: ${props => props.active ? '#45a049' : '#e0e0e0'};
    cursor: pointer;
  }

  @media (max-width: 480px) {
    width: 100%;
    padding: 10px;
    font-size: 1rem;
    margin: 0 0 10px 0;

  }
`;

export const RangeSlider = styled.input`
  width: 100%;
  margin: 10px 0;
  -webkit-appearance: none;
  height: 10px;
  border-radius: 5px;
  background: #d3d3d3;
  outline: none;

  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: #4CAF50;
    cursor: pointer;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;

    &::-webkit-slider-thumb {
      background: #ccc;
      cursor: not-allowed;
    }
  }

  @media (max-width: 480px) {
    height: 12px;
  }
`;

export const ValueDisplay = styled.div`
  font-size: 1.2rem;
  font-weight: bold;
  color: #2c3e50;
  margin: 5px 0;

  @media (max-width: 480px) {
    font-size: 1rem;
    text-align: center;
  }
`;
