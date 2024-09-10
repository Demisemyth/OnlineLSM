import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Welcome from "./Welcome";
import { GlobalStyle } from './GlobalStyle';
import styled from "styled-components";
import { theme } from './theme';

export default function Admin() {
  const [user, setUser] = useState(undefined);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!localStorage.getItem("secret-key-admin")) {
          navigate("/login");
        } else {
          const storedUser = JSON.parse(localStorage.getItem("secret-key-admin"));
          setUser(storedUser);

        }
      } catch (error) {
        console.error("Error fetching user data", error);
      }
    };
    fetchData();
  }, [navigate]);

  return (
    <>
      <GlobalStyle />
      <Container>
        <div className="container">
          <Welcome user={user} />
        </div>
      </Container>
    </>
  );
}

const Container = styled.div`
  height: 100vh;
  width: 100vw;
  background-color: ${theme.backgroundColor}; /* Use theme color */

  .container {
    height: 85vh;
    width: 85vw;
    background-color: ${theme.cardBackground}; /* Use theme color */
    display: grid;
    grid-template-columns: 25% 75%;
    @media screen and (min-width: 720px) and (max-width: 1080px) {
      grid-template-columns: 35% 65%;
    }
  }
`;
