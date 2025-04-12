import styled from 'styled-components';

export const ObjectCard = styled.div`
  position: relative;
  width: 220px;
  height: 320px;
  perspective: 1000px;
`;

export const CardInner = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  transform-style: preserve-3d;
  transition: transform 0.6s ease;

  ${ObjectCard}:hover & {
    transform: rotateY(180deg);
    cursor: pointer;
  }
`;

export const ObjectFront = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  background-color: #fff;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.1);
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;

  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: center;
  text-align: center;

  img {
    width: 100%;
    height: 70%;
    object-fit: cover;
  }

  h4 {
    margin: 1rem 0;
    color: #2c5282;
    font-size: 1.1rem;
  }
`;

export const ObjectBack = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  background-color: #f7fafc;
  border-radius: 16px;
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.1);
  transform: rotateY(180deg);
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;

  display: flex;
  justify-content: center;
  align-items: center;
  padding: 1rem;
  text-align: center;
  color: #2c5282;

  p {
    font-size: 1rem;
  }
`;
