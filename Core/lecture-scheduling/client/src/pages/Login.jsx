import React, { useState, useEffect } from "react";
import axios from "axios";
import styled from "styled-components";
import { useNavigate, Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { loginRoute } from "../utils/APIRoutes";
import backgroundImage from "../assets/imagethree.avif";

export default function Login() {
  const navigate = useNavigate();
  const [values, setValues] = useState({ username: "", password: "" });
  const toastOptions = {
    position: "bottom-right",
    autoClose: 8000,
    pauseOnHover: true,
    draggable: true,
    theme: "dark",
  };

  useEffect(() => {
    if (localStorage.getItem("secret-key-admin")) {
      navigate("/admin");
    } else if (localStorage.getItem("secret-key")) {
      navigate("/instructor");
    }
  }, [navigate]);

  const handleChange = (event) => {
    setValues({ ...values, [event.target.name]: event.target.value });
  };

  const validateForm = () => {
    const { username, password } = values;
    if (username === "" || password === "") {
      toast.error("Username and Password are required.", toastOptions);
      return false;
    }
    return true;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (validateForm()) {
      const { username, password } = values;
      const { data } = await axios.post(loginRoute, {
        username,
        password,
      });
      if (data.status === false) {
        toast.error(data.msg, toastOptions);
      }
      if (data.status === true) {
        if (data.user.isAdmin) {
          localStorage.setItem("secret-key-admin", JSON.stringify(data.user));
          navigate("/admin");
        } else {
          localStorage.setItem("secret-key", JSON.stringify(data.user));
          navigate("/instructor");
        }
      }
    }
  };

  return (
    <Container>
      <FormSection>
        <form onSubmit={handleSubmit}>
          <div className="brand">
            <h1>Course Schedule</h1>
          </div>
          <Input
            type="text"
            placeholder="Username"
            name="username"
            onChange={handleChange}
            min="3"
          />
          <Input
            type="password"
            placeholder="Password"
            name="password"
            onChange={handleChange}
          />
          <SubmitButton type="submit">Log In</SubmitButton>
          <span>
            Don't have an account? <Link to="/register">Create One.</Link>
          </span>
        </form>
      </FormSection>
      <ImageSection />
      <ToastContainer />
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  height: 100vh;
  width: 100vw;
  background-color: #121212; /* Dark background */
`;

const FormSection = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 2rem;

  .brand {
    display: flex;
    align-items: center;
    gap: 1rem;
    justify-content: center;

    h1 {
      color: #bb86fc; /* Light purple for branding */
      text-transform: uppercase;
      font-size: 2rem;
    }
  }

  form {
    display: flex;
    flex-direction: column;
    gap: 2rem;
    background-color: #1f1f1f; /* Dark form background */
    border-radius: 1rem;
    padding: 2rem;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.5);
    width: 100%;
    max-width: 400px;
    margin: 0 auto;
  }

  span {
    color: #bb86fc; /* Light purple text */
    text-transform: uppercase;
    text-align: center;
    font-weight: bold;
    font-size: 0.9rem;

    a {
      color: #03dac6; /* Teal link color */
      text-decoration: none;
      font-weight: bold;
    }
  }
`;

const ImageSection = styled.div`
  flex: 1;
  background: url(${backgroundImage}) no-repeat center center;
  background-size: cover;
  border-radius: 1rem; /* Rounded corners for all sides */
  overflow: hidden; /* Ensure image stays within rounded corners */
  height: 100vh; /* Full height of viewport */
  position: relative; /* For overlay positioning */
  border: 4px solid rgba(255, 255, 255, 0.4); /* Subtle, semi-transparent border */
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5); /* Enhanced shadow for depth */

  /* Optional: Gradient overlay for improved contrast */
  &:before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(to bottom, rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.5)); /* Dark gradient overlay */
    border-radius: 1rem; /* Match rounded corners */
    z-index: 1;
  }

  /* Ensure content inside ImageSection is above overlay */
  & > * {
    position: relative;
    z-index: 2;
  }
`;




const Input = styled.input`
  padding: 1rem;
  border: 0.1rem solid #333; /* Darker border */
  border-radius: 0.4rem;
  color: #e0e0e0; /* Light text color */
  background-color: #333; /* Dark input background */
  width: 100%;
  font-size: 1rem;

  &:focus {
    border: 0.1rem solid #bb86fc; /* Light purple focus border */
    outline: none;
  }
`;

const SubmitButton = styled.button`
  background-color: #bb86fc; /* Light purple */
  color: #121212; /* Dark text color */
  padding: 1rem 2rem;
  border: none;
  font-weight: bold;
  cursor: pointer;
  border-radius: 0.4rem;
  font-size: 1rem;
  text-transform: uppercase;
  transition: background-color 0.3s ease, box-shadow 0.3s ease;

  &:hover {
    background-color: #a06efc; /* Darker purple on hover */
    box-shadow: 0 0 10px 2px rgba(187, 134, 252, 0.5); /* Purple glow */
  }
`;
