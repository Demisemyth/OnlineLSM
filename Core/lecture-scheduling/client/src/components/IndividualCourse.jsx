import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Logout from "./Logout";
import { useNavigate, useParams } from "react-router-dom";
import {
  getSchedule,
  allInstructors,
  getCourseName,
  addSchedule,
  checkAvailable,
} from "../utils/APIRoutes";
import axios from "axios";

// Define dark mode color scheme
const theme = {
  backgroundColor: "#121212",
  topBarBackground: "#1f1f1f",
  headingColor: "#e0e0e0",
  cardBackground: "#1f1f1f",
  cardHoverBackground: "#333",
  textColor: "#e0e0e0",
  formBackground: "#333",
  buttonColor: "#bb86fc",
  buttonHoverColor: "#a06efc",
  borderColor: "#333",
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 0;
  height: 100vh;
  background-color: ${theme.backgroundColor};
`;

const TopBar = styled.div`
  width: 100%;
  background: ${theme.topBarBackground};
  padding: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Heading = styled.h1`
  color: ${theme.headingColor};
  font-size: 24px;
  font-weight: bold;
  margin: 0;
`;

const CourseName = styled.h1`
  color: ${theme.headingColor};
  margin-bottom: 20px;
`;

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  padding: 20px;
`;

const CardList = styled.div`
  width: 100%;
  margin-top: 20px;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
`;

const NoScheduleMessage = styled.p`
  width: 100%;
  text-align: center;
  font-size: 18px;
  color: ${theme.textColor};
`;

const Card = styled.div`
  background-color: ${theme.cardBackground};
  border: 1px solid ${theme.borderColor};
  border-radius: 15px;
  margin-bottom: 20px;
  padding: 20px;
  width: calc(45% - 20px);
  box-sizing: border-box;
  transition: transform 0.2s ease-in-out;
  overflow: hidden;

  &:hover {
    background-color: ${theme.cardHoverBackground};
    transform: scale(1.06);
  }

  .card-content {
    color: ${theme.textColor};
  }

  h2 {
    margin-bottom: 10px;
    font-size: 20px;
  }

  p {
    margin-bottom: 5px;
    font-size: 16px;
  }
`;

const Form = styled.form`
  width: 45%;
  background-color: ${theme.formBackground};
  color: ${theme.textColor};
  border: 1px solid ${theme.borderColor};
  border-radius: 15px;
  text-align: center;
  padding: 20px;

  select,
  input {
    margin: 10px 0;
    padding: 10px;
    width: calc(100% - 20px);
    border-radius: 5px;
    border: 1px solid ${theme.borderColor};
    box-sizing: border-box;
    background-color: ${theme.cardBackground};
    color: ${theme.textColor};
  }

  button {
    margin-top: 20px;
    padding: 10px;
    background-color: ${theme.buttonColor};
    color: ${theme.textColor};
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-size: 16px;

    &:hover {
      background-color: ${theme.buttonHoverColor};
    }
  }
`;

const IndividualCourse = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [dropUser, setDropUser] = useState("");
  const [id, setId] = useState(null);
  const [courseName, setCourseName] = useState("Dummy Course");
  const [instructorData, setInstructorData] = useState([]);
  const [selectedInstructor, setSelectedInstructor] = useState("");
  const [schedule, setSchedule] = useState([]);
  const [lectureData, setLectureData] = useState({
    instructor: "",
    date: "",
    subject: "",
    lecture: "",
    location: "",
  });

  const adminKey = localStorage.getItem("secret-key-admin");
  const userKey = localStorage.getItem("secret-key");

  useEffect(() => {
    if (adminKey) {
      const adminUserData = JSON.parse(adminKey);
      setId(adminUserData._id);
    } else if (userKey) {
      navigate("/instructor");
    } else {
      navigate("/");
    }
  }, [navigate, adminKey, userKey]);

  const updateInstructorData = (instructor) => {
    const existingInstructor = instructorData.find(
      (i) => i === instructor.username
    );
    if (!existingInstructor) {
      setInstructorData((prevData) => [...prevData, instructor.username]);
    }
  };

  const getCourseNameById = async (courseId) => {
    try {
      const response = await axios.get(`${getCourseName}/${courseId}`);
      return response.data.courseName;
    } catch (error) {
      console.error("Error fetching course name:", error);
      return null;
    }
  };

  useEffect(() => {
    const fetchCourseName = async () => {
      try {
        if (courseId) {
          setCourseName(await getCourseNameById(courseId));
        }
      } catch (error) {
        console.error("Error fetching course name:", error);
      }
    };
    fetchCourseName();
  }, [courseId]);

  useEffect(() => {
    const fetchInstructors = async () => {
      try {
        if (id) {
          const response = await axios.get(`${allInstructors}/${id}`);
          const fetchedInstructors = response.data;
          fetchedInstructors.forEach(updateInstructorData);
        }
      } catch (error) {
        console.error("Error fetching instructors:", error);
      }
    };
    fetchInstructors();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLectureData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleInstructorSelection = (e) => {
    const selectedInstructor = e.target.value;
    setDropUser(selectedInstructor);
    setSelectedInstructor(selectedInstructor);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const course = courseName;
    const scheduleData = {
      course: course,
      lecture: lectureData.lecture,
      date: lectureData.date,
      instructor: dropUser,
      location: lectureData.location,
    };

    try {
      const availabilityCheckResponse = await axios.post(checkAvailable, {
        username: dropUser,
        date: lectureData.date,
      });

      if (availabilityCheckResponse.status === 200) {
        const response = await axios.post(addSchedule, scheduleData);
        console.log("Schedule added successfully:", response.data);
      } else {
        console.error("Instructor is busy on this date.");
      }
    } catch (error) {
      console.error("Error checking instructor availability:", error);
    }

    setLectureData({
      instructor: "",
      date: "",
      subject: "",
      lecture: "",
      location: "",
    });
  };

  useEffect(() => {
    const fetchSchedules = async () => {
      try {
        const response = await axios.get(getSchedule, {
          params: { courseName },
        });
        setSchedule(response.data.schedules);
      } catch (error) {
        console.error("Error fetching Schedule:", error);
      }
    };
    fetchSchedules();
  }, [courseName, dropUser]);

  return (
    <Container>
      <TopBar>
        <Logout />
        <CourseName>{courseName}</CourseName>
        <Heading>Welcome admin</Heading>
      </TopBar>
      <ContentWrapper>
        {schedule.length === 0 ? (
          <NoScheduleMessage>No lectures scheduled.</NoScheduleMessage>
        ) : (
          <CardList>
            {schedule.map((scheduleItem, index) => (
              <Card key={index}>
                <div className="card-content">
                  <h2>Lecture: {scheduleItem.lecture}</h2>
                  <p>Instructor: {scheduleItem.instructor}</p>
                  <p>
                    Date: {new Date(scheduleItem.date).toLocaleDateString()}
                  </p>
                  <p>Location: {scheduleItem.location}</p>
                </div>
              </Card>
            ))}
          </CardList>
        )}
        <Form onSubmit={handleSubmit}>
          <h2>Schedule a Lecture</h2>
          <select
            name="instructor"
            value={selectedInstructor}
            onChange={handleInstructorSelection}
            required
          >
            <option value="" disabled>
              Select Instructor
            </option>
            {instructorData.map((instructor, index) => (
              <option key={index} value={instructor}>
                {instructor}
              </option>
            ))}
          </select>
          <input
            type="date"
            name="date"
            placeholder="Date"
            value={lectureData.date}
            onChange={handleChange}
            required
          />
          <select
            name="subject"
            value={lectureData.subject}
            onChange={handleChange}
            required
          >
            <option value="" disabled>
              Select Course
            </option>
            <option>{courseName}</option>
          </select>
          <input
            type="text"
            name="lecture"
            placeholder="Lecture"
            value={lectureData.lecture}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="location"
            placeholder="Location"
            value={lectureData.location}
            onChange={handleChange}
            required
          />
          <button type="submit">Schedule Lecture</button>
        </Form>
      </ContentWrapper>
    </Container>
  );
};

export default IndividualCourse;
