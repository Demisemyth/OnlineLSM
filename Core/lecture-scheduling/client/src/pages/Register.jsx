import React, { useState, useEffect } from "react";
import axios from "axios";
import styled from "styled-components";
import { useNavigate, Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { registerRoute } from "../utils/APIRoutes";
import backgroundImage from "../assets/image.avif";

export default function Register() {
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem("secret-key-admin")) {
      navigate("/admin");
    } else if (localStorage.getItem("secret-key")) {
      navigate("/instructor");
    }
  }, [navigate]);

  const [values, setValues] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    isAdmin: false,
  });

  const toastOptions = {
    position: "bottom-right",
    autoClose: 8000,
    pauseOnHover: true,
    draggable: true,
    theme: "dark",
  };

  const handleValidation = () => {
    const { password, confirmPassword, username, email } = values;
    if (password !== confirmPassword) {
      toast.error(
        "Password and confirm password should be the same.",
        toastOptions
      );
      return false;
    } else if (username.length < 3) {
      toast.error(
        "Username should be greater than 3 characters.",
        toastOptions
      );
      return false;
    } else if (password.length < 8) {
      toast.error(
        "Password should be equal or greater than 8 characters.",
        toastOptions
      );
      return false;
    } else if (email === "") {
      toast.error("Email is required.", toastOptions);
      return false;
    }
    return true;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (handleValidation()) {
      const { email, username, password } = values;
      const { data } = await axios.post(registerRoute, {
        username,
        email,
        password,
        isAdmin: values.isAdmin,
      });

      if (data.status === false) {
        toast.error(data.msg, toastOptions);
      }

      if (data.status === true) {
        if (data.user.isAdmin === true) {
          localStorage.setItem("secret-key-admin", JSON.stringify(data.user));
          navigate("/admin");
        } else if (data.user.isAdmin === false) {
          localStorage.setItem("secret-key", JSON.stringify(data.user));
          navigate("/instructor");
        }
      }
    }
  };

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    const newValue = type === "checkbox" ? checked : value;
    setValues({ ...values, [name]: newValue });
  };

  return (
    <Container>
      <FormSection>
        <div className="brand">
          <h1>Course Schedule</h1>
        </div>
        <form onSubmit={handleSubmit}>
          <Input
            type="text"
            placeholder="Username"
            name="username"
            onChange={handleChange}
          />
          <Input
            type="email"
            placeholder="Email"
            name="email"
            onChange={handleChange}
          />
          <Input
            type="password"
            placeholder="Password"
            name="password"
            onChange={handleChange}
          />
          <Input
            type="password"
            placeholder="Confirm Password"
            name="confirmPassword"
            onChange={handleChange}
          />
          <div className="checkbox-container">
            <Checkbox
              type="checkbox"
              id="isAdmin"
              name="isAdmin"
              checked={values.isAdmin}
              onChange={handleChange}
            />
            <label htmlFor="isAdmin">Admin</label>
          </div>
          <SubmitButton type="submit">Create User</SubmitButton>
          <span>
            Already have an account? <Link to="/login">Login.</Link>
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
  overflow: hidden; /* Prevent overflow */
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

  .checkbox-container {
    display: flex;
    align-items: center;
    gap: 0.5rem;

    label {
      color: #ffffff; /* White label text */
      font-size: 1rem;
    }
  }
`;

const ImageSection = styled.div`
  flex: 1;
  background: url(${backgroundImage}) no-repeat center center;
  background-size: cover;
  border-radius: 1rem; /* Rounded corners for all sides */
  overflow: hidden; /* Ensure image stays within rounded corners */
  height: 100%; /* Full height of parent container */
  width: 100%; /* Full width of parent container */
  position: relative; /* For overlay positioning */
  border: 4px solid rgba(255, 255, 255, 0.3); /* Subtle, semi-transparent border */
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.6); /* Enhanced shadow for more depth */

  /* Optional: Gradient overlay for improved contrast */
  &:before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(to bottom, rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.6)); /* Dark gradient overlay */
    border-radius: 1rem; /* Match rounded corners */
    z-index: 1;
    pointer-events: none; /* Ensure the overlay does not block interactions */
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

const Checkbox = styled.input`
  appearance: none;
  width: 1.5rem;
  height: 1.5rem;
  border: 0.1rem solid #bb86fc; /* Light purple border */
  border-radius: 0.2rem;
  outline: none;
  margin-right: 0.5rem;
  cursor: pointer;
  position: relative;

  &:checked {
    background-color: #bb86fc; /* Light purple background */
    border-color: #bb86fc; /* Light purple border */

    &:before {
      content: "\u2713";
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      color: white;
      font-size: 1.2rem;
    }
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
