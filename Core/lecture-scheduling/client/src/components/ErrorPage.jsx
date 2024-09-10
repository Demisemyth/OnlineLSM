import React from "react";
import styled from "styled-components";
import { theme } from './admin/theme';

const ErrorPage = () => {
  return (
    <ErrorContainer>
      <ErrorMessage>Oops! Something went wrong.</ErrorMessage>

    </ErrorContainer>
  );
};

const ErrorContainer = styled.div`
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: ${theme.backgroundColor}; /* Dark mode background */
  color: ${theme.textColor}; /* Dark mode text color */
`;

const ErrorMessage = styled.h1`
  font-size: 24px;
  color: ${theme.errorColor}; /* Error color for dark mode */
  margin-bottom: 20px;
`;

export default ErrorPage;
