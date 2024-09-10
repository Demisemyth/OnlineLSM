import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { allInstructors, getCourse } from '../../utils/APIRoutes';
import styled from 'styled-components';
import { theme } from '../admin/theme';

const DeletePage = () => {
  const [instructors, setInstructors] = useState([]);
  const [courses, setCourses] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const instructorResponse = await axios.get(allInstructors);
        setInstructors(instructorResponse.data);
        const courseResponse = await axios.get(getCourse);
        setCourses(courseResponse.data);
      } catch (error) {
        setError('Error fetching data');
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);

  const handleDelete = async (id, type) => {
    try {
      await axios.delete(`/api/auth/delete${type}/${id}`);
      // Refresh data after deletion
      const instructorResponse = await axios.get(allInstructors);
      setInstructors(instructorResponse.data);
      const courseResponse = await axios.get(getCourse);
      setCourses(courseResponse.data);
    } catch (error) {
      setError('Error deleting item');
      console.error('Error deleting item:', error);
    }
  };

  return (
    <DeleteContainer>
      <Error>{error}</Error>
      <Section>
        <h2>Instructors</h2>
        {instructors.length ? (
          <List>
            {instructors.map((instructor) => (
              <ListItem key={instructor._id}>
                {instructor.name}
                <DeleteButton onClick={() => handleDelete(instructor._id, 'Instructor')}>
                  Delete
                </DeleteButton>
              </ListItem>
            ))}
          </List>
        ) : (
          <p>No instructors found.</p>
        )}
      </Section>
      <Section>
        <h2>Courses</h2>
        {courses.length ? (
          <List>
            {courses.map((course) => (
              <ListItem key={course._id}>
                {course.title}
                <DeleteButton onClick={() => handleDelete(course._id, 'Course')}>
                  Delete
                </DeleteButton>
              </ListItem>
            ))}
          </List>
        ) : (
          <p>No courses found.</p>
        )}
      </Section>
    </DeleteContainer>
  );
};

const DeleteContainer = styled.div`
  width: 90%;
  max-width: 1200px;
  padding: 20px;
  background-color: ${theme.cardBackground};
  border-radius: 12px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.4);
  margin-top: 20px;
  color: ${theme.textColor};
`;

const Section = styled.div`
  margin-bottom: 20px;
`;

const List = styled.ul`
  list-style-type: none;
  padding: 0;
`;

const ListItem = styled.li`
  background: ${theme.cardBackground};
  padding: 10px;
  margin-bottom: 10px;
  border-radius: 8px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
`;

const DeleteButton = styled.button`
  background-color: ${theme.buttonColor};
  color: ${theme.textColor};
  border: none;
  padding: 5px 10px;
  border-radius: 5px;
  cursor: pointer;

  &:hover {
    background-color: ${theme.buttonHoverColor};
  }
`;

const Error = styled.div`
  color: ${theme.errorColor};
  margin-bottom: 20px;
`;

export default DeletePage;
