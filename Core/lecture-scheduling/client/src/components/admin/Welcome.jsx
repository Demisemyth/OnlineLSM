
import React, { useEffect } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import Instructors from "./Instructors";
import Courses from "./CoursesAdmin";
import Logout from "../Logout";
import DeleteComponent from "./DeletePage";
import { theme } from './theme';

export default function Welcome({ user }) {
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem("secret-key-admin")) {
      navigate("/admin");
    } else if (localStorage.getItem("secret-key")) {
      navigate("/instructor");
    } else {
      navigate("/");
    }
  }, [navigate]);

  return (
    <WelcomeContainer>
      <TopBar>
        <Logout />
        <Heading>Welcome Admin</Heading>
      </TopBar>
      <MainContent>
        <InstructorsContainer>
          <Instructors user={user} />
        </InstructorsContainer>
        <CoursesContainer>
          <Courses user={user} />
        </CoursesContainer>
      </MainContent>
      <DeleteContainer>
        <DeleteComponent />
      </DeleteContainer>
    </WelcomeContainer>
  );
}



const WelcomeContainer = styled.div`
  height: 100vh;
  width: 100vw;
  background-color: ${theme.backgroundColor}; /* Apply theme color */
  display: flex;
  flex-direction: column;
  align-items: center;
  color: ${theme.textColor}; /* Apply theme color */
`;

const MainContent = styled.div`
  flex: 1;
  display: flex;
  justify-content: space-between;
  gap: 2rem;
  min-height: calc(100vh - 60px); /* Adjust for TopBar height */
  width: 100%;
  padding: 1rem;
  box-sizing: border-box;
`;

const InstructorsContainer = styled.div`
  width: 45%;
  background-color: ${theme.cardBackground}; /* Apply theme color */
  color: ${theme.textColor}; /* Apply theme color */
  padding: 1rem;
  border-radius: 12px; /* Modern rounded corners */
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.6); /* Stronger shadow for better contrast */
  overflow: hidden;
`;

const CoursesContainer = styled.div`
  width: 50%;
  background-color: ${theme.cardBackground}; /* Apply theme color */
  color: ${theme.textColor}; /* Apply theme color */
  padding: 1rem;
  border-radius: 12px; /* Modern rounded corners */
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.6); /* Stronger shadow for better contrast */
  overflow: hidden;
`;

const DeleteContainer = styled.div`
  width: 90%;
  max-width: 1200px;
  padding: 20px;
  background-color: ${theme.cardBackground}; /* Apply theme color */
  border-radius: 12px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.4);
  margin-top: 20px; /* Ensure there's space above it */
  color: ${theme.textColor}; /* Apply theme color */
`;


const TopBar = styled.div`
  width: 100%;
  background: ${theme.backgroundColor}; /* Dark mode background */
  padding: 10px 15px; /* Reduced padding for a sleeker look */
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid ${theme.borderColor}; /* Apply theme color */
  border-radius: 0 0 10px 10px; /* Rounded bottom corners */
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3); /* Subtle shadow for depth */
`;

const Heading = styled.h1`
  color: ${theme.accentColor}; /* Keep the color */
  font-size: 22px; /* Reduced size for a more modern look */
  font-weight: 700; /* Bold for emphasis */
  letter-spacing: 0.5px; /* Slight letter spacing */
  text-shadow: 0 2px 3px rgba(0, 0, 0, 0.3); /* Softer text shadow */
  margin: 0;
  text-transform: uppercase; /* Uppercase for a contemporary style */
  line-height: 1.2; /* Improved line height for readability */
`;
