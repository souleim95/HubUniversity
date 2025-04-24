import styled from 'styled-components';

export const MenuContainer = styled.div`
  position: relative;
  display: inline-block;
  z-index: 1001;
`;

export const MenuButton = styled.div`
  width: 50px;
  height: 50px;
  background: linear-gradient(135deg, #6a11cb, #2575fc);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.3rem;
  font-weight: bold;
  cursor: pointer;
  transition: transform 0.3s ease, background 0.3s ease, box-shadow 0.3s ease;
  user-select: none;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  position: relative;
  z-index: 1002;

  &:hover {
    background: linear-gradient(135deg, #2575fc, #6a11cb);
    transform: scale(1.15);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.3);
  }

  @media (max-width: 480px) {
    width: 45px;
    height: 45px;
    font-size: 1.1rem;
  }
`;

export const DropdownMenu = styled.div`
  position: absolute;
  top: 65px;
  right: 0;
  background-color: white;
  border-radius: 16px;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
  min-width: 240px;
  z-index: 1003;
  animation: fadeIn 0.3s ease-in-out;
  overflow: hidden;
  border: 1px solid rgba(0, 0, 0, 0.1);

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(-15px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

export const DropdownItem = styled.div`
  padding: 16px 24px;
  cursor: pointer;
  color: #2575fc;
  font-size: 1.1rem;
  font-weight: 500;
  transition: background-color 0.3s ease, color 0.3s ease;
  text-align: center;
  border-bottom: 1px solid #eaeaea;

  &:hover {
    background-color: #f0f4ff;
    color: #6a11cb;
  }

  &:last-child {
    border-bottom: none;
  }

  &.logout {
    color: #ff4d4f;
    font-weight: bold;

    &:hover {
      background-color: #ffecec;
      color: #d9363e;
    }
  }

  &.dashboard {
    color: rgb(17, 68, 97);
    font-weight: bold;

    &:hover {
      background-color: #eaf6ff;
      color: #1a73e8;
    }
  }
`;

export const ProfileIcon = styled.div`
  width: 100px;
  height: 100px;
  background-color: #f0f4ff;
  color: #2575fc;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1.6rem;
  font-weight: bold;
  margin: 10px auto;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
  transition: transform 0.3s ease, box-shadow 0.3s ease;

  &:hover {
    transform: scale(1.1);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.25);
  }
`;

export const UserAvatar = styled.img`
  width: 45px;
  height: 45px;
  border-radius: 50%;
  object-fit: cover;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;
