import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useNavigate, useParams } from "react-router-dom";
import Logout from "../Logout";
import { getUserSchedule } from "../../utils/APIRoutes";
import axios from "axios";
import loaderImage from "../../assets/loader.gif";
import { theme } from './theme'; // Ensure your theme.js file exports these colors

const IndividualInstructor = () => {
  const navigate = useNavigate();
  const { username } = useParams(); // Get instructor's username from URL params
  const [currUser, setCurrUser] = useState(undefined); // Current logged-in user (admin)
  const [schedules, setSchedules] = useState([]); // Stores schedules fetched from the API
  const [loading, setLoading] = useState(true); // Loading state to show a loader before data fetch

  // Retrieve admin token to ensure only admins can access the page
  const adminKey = localStorage.getItem("secret-key-admin");

  // Check if the user is logged in as admin
  useEffect(() => {
    if (!adminKey) {
      localStorage.clear();
      navigate("/"); // Redirect to homepage if not admin
    }
  }, [adminKey, navigate]);

  // Fetch schedules for the instructor when the component mounts
  useEffect(() => {
    setCurrUser(username); // Set the current instructor's username from params

    const fetchSchedules = async () => {
      try {
        const response = await axios.get(getUserSchedule, {
          params: { currUser: username },
        });
        setSchedules(response.data.schedules); // Store fetched schedules in state
      } catch (error) {
        console.error("Error fetching Schedule:", error); // Handle errors
      } finally {
        setLoading(false); // Set loading to false after fetch is complete
      }
    };

    fetchSchedules(); // Fetch schedules once component is mounted
  }, [username, navigate]);

  // If data is still loading, show a loader
  if (loading) {
    return (
      <LoaderContainer>
        <LoaderImage src={loaderImage} alt="Loading..." />
      </LoaderContainer>
    );
  }

  // Return the main UI once data is loaded
  return (
    <WelcomeContainer>
      <TopBar>
        <Logout />
        <Heading>Welcome Admin</Heading>
      </TopBar>
      <MainContent>
        <LecturesContainer>
          <SectionHeading>Upcoming Lectures for {currUser}</SectionHeading>
          <ScrollableContent>
            {schedules.length > 0 ? (
              schedules.map((schedule, index) => (
                <LectureCard key={index}>
                  <CardHeading>Course:</CardHeading>
                  <CourseContent>{schedule.course}</CourseContent>

                  <CardHeading>Lecture:</CardHeading>
                  <LectureContent>{schedule.lecture}</LectureContent>

                  <CardHeading>Date:</CardHeading>
                  <DateContent>
                    {new Date(schedule.date).toLocaleDateString()}
                  </DateContent>

                  <CardHeading>Location:</CardHeading>
                  <LocationContent>{schedule.location}</LocationContent>
                </LectureCard>
              ))
            ) : (
              <NoSchedulesMessage>No schedules available</NoSchedulesMessage>
            )}
          </ScrollableContent>
        </LecturesContainer>
      </MainContent>
    </WelcomeContainer>
  );
};

// Styled components for dark mode and layout

const LoaderContainer = styled.div`
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${theme.backgroundColor};
`;

const LoaderImage = styled.img`
  width: 60px;
  height: 60px;
`;

const WelcomeContainer = styled.div`
  height: 100vh;
  width: 100vw;
  background-color: ${theme.backgroundColor};
  padding-bottom: 1rem;
  color: ${theme.textColor};
`;

const TopBar = styled.div`
  width: 100%;
  background: ${theme.topBarBackground};
  padding: 15px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid ${theme.borderColor};
  border-radius: 0 0 10px 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.5);
`;

const Heading = styled.h1`
  color: ${theme.headingColor};
  font-size: 24px;
  font-weight: 700;
  letter-spacing: 0.5px;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.4);
  margin: 0;
  text-transform: uppercase;
  line-height: 1.2;
`;

const LecturesContainer = styled.div`
  width: 100%;
  padding: 10px;
`;

const ScrollableContent = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 1rem;
  max-height: 450px;
  overflow-y: auto;
`;

const LectureCard = styled.div`
  background-color: ${theme.cardBackground};
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
  margin-top: 10px;
  width: 45%;
  box-sizing: border-box;
  transition: transform 0.3s, box-shadow 0.3s;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.6);
  }
`;

const SectionHeading = styled.h2`
  color: ${theme.accentColor};
  font-size: 24px;
  margin-bottom: 15px;
`;

const CardHeading = styled.h3`
  color: ${theme.textColor};
  font-size: 20px;
  margin-bottom: 10px;
`;

const CardContent = styled.p`
  margin-bottom: 15px;
  font-size: 18px;
  color: ${theme.textColor};
`;

const CourseContent = styled(CardContent)`
  color: ${theme.courseContentColor};
  font-weight: bold;
  font-size: 20px;
`;

const LectureContent = styled(CardContent)`
  color: ${theme.lectureContentColor};
  font-style: italic;
  font-weight: bold;
`;

const DateContent = styled(CardContent)`
  color: ${theme.dateContentColor};
  font-weight: bold;
`;

const LocationContent = styled(CardContent)`
  color: ${theme.locationContentColor};
`;

const MainContent = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 1rem;
  padding: 10px;
  width: 100%;
`;

const NoSchedulesMessage = styled.p`
  width: 100%;
  text-align: center;
  color: ${theme.textColor};
`;

export default IndividualInstructor;
