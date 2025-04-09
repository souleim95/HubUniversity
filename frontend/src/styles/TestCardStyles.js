import styled from 'styled-components';

export const ObjectCard = styled.div`
  position: relative;
  width: 200px;
  height: 300px;
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
  }
`;

export const ObjectFront = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  background-color: lightblue;
  border: 3px solid blue;
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const ObjectBack = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  background-color: tomato;
  border: 3px solid red;
  transform: rotateY(180deg);
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
`;
