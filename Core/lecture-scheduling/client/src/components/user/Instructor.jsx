import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import Logout from "../Logout";
import { getUserSchedule } from "../../utils/APIRoutes";
import axios from "axios";
import loaderImage from "../../assets/loader.gif";

const Instructor = ({}) => {
  const navigate = useNavigate();
  const [currUser, setCurrUser] = useState(undefined);
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);

  const adminKey = localStorage.getItem("secret-key-admin");
  const userKey = localStorage.getItem("secret-key");

  useEffect(() => {
    if (adminKey) {
      navigate("/admin");
    } else if (userKey) {
      setCurrUser(JSON.parse(userKey).username);
    } else {
      navigate("/");
    }
  }, [navigate]);

  useEffect(() => {
    const fetchSchedules = async () => {
      try {
        const response = await axios.get(getUserSchedule, {
          params: { currUser },
        });
        setSchedules(response.data.schedules);
      } catch (error) {
        console.error("Error fetching Schedule:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchSchedules();
  }, [currUser, navigate]);

  if (loading) {
    return (
      <LoaderContainer>
        <LoaderImage src={loaderImage} alt="Loading..." />
      </LoaderContainer>
    );
  }

  return (
    <WelcomeContainer>
      <TopBar>
        <Heading>Welcome {currUser}</Heading>
        <Logout />
      </TopBar>
      <MainContent>
        <LecturesContainer>
          <SectionHeading>Your Upcoming Lectures</SectionHeading>
          <ScrollableContent>
            {schedules.map((schedule, index) => (
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
            ))}
          </ScrollableContent>
        </LecturesContainer>
      </MainContent>
    </WelcomeContainer>
  );
};

const LoaderContainer = styled.div`
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #121212; /* Dark background for loader */
`;

const LoaderImage = styled.img`
  width: 60px;
  height: 60px;
`;

const WelcomeContainer = styled.div`
  height: 100vh;
  width: 100vw;
  background-color: #121212; /* Dark background */
  padding-bottom: 1rem;
  color: #e0e0e0; /* Light text color */
`;

const TopBar = styled.div`
  width: 100%;
  background: linear-gradient(135deg, #1f1f1f 0%, #333 100%); /* Gradient background */
  padding: 15px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #333; /* Dark border */
  border-radius: 0 0 10px 10px; /* Rounded bottom corners */
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.5); /* Subtle shadow */
`;

const Heading = styled.h1`
  color: #bb86fc; /* Accent color for heading */
  font-size: 24px; /* Slightly smaller for modern look */
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
  justify-content: space-around;
  gap: 1rem;
  max-height: 450px;
  overflow-y: auto;
`;

const LectureCard = styled.div`
  background-color: #1f1f1f; /* Dark card background */
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4); /* Deeper shadow */
  margin-top: 10px;
  width: 45%; /* Adjusted width */
  box-sizing: border-box;
  transition: transform 0.3s, box-shadow 0.3s; /* Hover effects */

  &:hover {
    transform: translateY(-5px); /* Lift effect on hover */
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.6); /* Enhanced shadow */
  }
`;

const SectionHeading = styled.h2`
  color: #bb86fc; /* Accent color for section heading */
  font-size: 24px;
  margin-bottom: 15px;
`;

const CardHeading = styled.h3`
  color: #e0e0e0; /* Light text color */
  font-size: 20px;
  margin-bottom: 10px;
`;

const CardContent = styled.p`
  margin-bottom: 15px;
  font-size: 18px;
  color: #c0c0c0; /* Light gray for content */
`;

const CourseContent = styled(CardContent)`
  color: #03dac6; /* Teal for course content */
  font-weight: bold;
`;

const LectureContent = styled(CardContent)`
  color: #ffffff; /* White for lecture content */
  font-style: italic;
`;

const DateContent = styled(CardContent)`
  color: #d4a2b0; /* Mauve Mist for date content */
`;

const LocationContent = styled(CardContent)`
  color: #c0c0c0; /* Light gray for location content */
`;

const MainContent = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 1rem;
  padding: 10px;
  width: 100%;
`;

export default Instructor;
