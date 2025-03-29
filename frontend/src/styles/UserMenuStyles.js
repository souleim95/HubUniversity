import styled from 'styled-components';

export const MenuContainer = styled.div`
  position: relative;
  display: inline-block;
`;

export const MenuButton = styled.div`
  width: 40px;
  height: 40px;
  background-color: rgb(15, 110, 173);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  cursor: pointer;
  user-select: none;
`;

export const DropdownMenu = styled.div`
  position: absolute;
  top: 50px;
  right: 0;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  min-width: 180px;
  z-index: 100;
`;

export const DropdownItem = styled.div`
  padding: 12px 16px;
  cursor: pointer;
  color: rgb(15, 110, 173);
  transition: background-color 0.2s ease;

  &:hover {
    background-color: #f5f7fa;
  }
`;
