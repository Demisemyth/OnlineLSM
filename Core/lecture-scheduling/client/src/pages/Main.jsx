import React, { useEffect } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";

const Main = () => {
  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate("/login");
  };

  const handleRegisterClick = () => {
    navigate("/register");
  };

  useEffect(() => {
    if (localStorage.getItem("secret-key-admin")) {
      navigate("/admin");
    } else if (localStorage.getItem("secret-key")) {
      navigate("/instructor");
    }
  }, [navigate]);

  return (
    <MainContainer>
      <Overlay>
        <Message>DarkLSM to Course Schedule</Message>
        <ButtonContainer>
          <Button onClick={handleLoginClick}>Login</Button>
          <Button onClick={handleRegisterClick}>Register</Button>
        </ButtonContainer>
      </Overlay>
    </MainContainer>
  );
};

const MainContainer = styled.div`
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: #121212; /* Dark background */
`;

const Overlay = styled.div`
  background: rgba(18, 18, 18, 0.9); /* Slightly transparent dark background */
  border-radius: 10px;
  padding: 30px;
  text-align: center;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3); /* Darker shadow */
`;

const Message = styled.h1`
  font-size: 28px;
  margin-bottom: 20px;
  color: #e0e0e0; /* Light gray text */
`;

const ButtonContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const Button = styled.button`
  padding: 15px;
  background-color: #1f1f1f; /* Dark button background */
  color: #e0e0e0; /* Light text color */
  border: 1px solid #333; /* Slightly lighter border */
  border-radius: 8px;
  cursor: pointer;
  font-size: 18px;
  transition: background-color 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease;

  &:hover {
    background-color: #333; /* Slightly lighter on hover */
    border-color: #666; /* Lighter border on hover */
    box-shadow: 0 0 10px 2px rgba(0, 255, 255, 0.7); /* Neon blue glow effect */
  }
`;


export default Main;
