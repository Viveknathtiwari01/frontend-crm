// src/components/LoginPage.jsx
import React, { useState } from "react";
import styled from "@emotion/styled";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: #1e1e1e; /* Subtle black background */
`;

const Card = styled.div`
  background: #2c2c2c; /* Dark card background */
  padding: 2.5rem;
  border-radius: 1rem;
  box-shadow: 0px 8px 30px rgba(0, 0, 0, 0.5);
  width: 100%;
  max-width: 400px;
  display: flex;
  flex-direction: column;
  justify-content: center; /* Centers all elements vertically inside the card */
  align-items: center; /* Centers all elements horizontally inside the card */

  @media (max-width: 768px) {
    width: 80%; /* Make modal width 90% of the screen width on small screens */
    height: 40%;
    padding: 1.8rem; /* Adjust padding for smaller screens */
  }
`;

const Title = styled.h1`
  font-size: 1.8rem;
  color: #ffffff;
  margin-bottom: 2rem;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center; /* Centers the text boxes horizontally */
  width: 100%; /* Ensures the inputs stretch across the card width */
  gap: 1rem; /* Adds consistent spacing between text boxes */
`;

const Input = styled.input`
  width: 100%; /* Makes the input stretch to fill the card width */
  max-width: 370px; /* Limits the maximum width of the input */
  padding: 0.8rem;
  border: 1px solid #444;
  border-radius: 0.5rem;
  font-size: 1rem;
  background-color: #3a3a3a;
  color: #fff;

  &:focus {
    border-color: #6c63ff;
    outline: none;
  }
`;

const Button = styled.button`
  width: 100%; /* Button stretches across the card width */
  max-width: 300px; /* Matches the max-width of inputs */
  padding: 0.8rem;
  background: #6c63ff;
  color: #fff;
  border: none;
  border-radius: 0.5rem;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.3s;

  &:hover {
    background: #5847eb;
  }
`;

const Link = styled.a`
  margin-top: 1rem;
  color: #6c63ff;
  text-decoration: none;
  font-size: 0.9rem;

  &:hover {
    text-decoration: underline;
  }
`;

const Message = styled.p`
  color: ${(props) => (props.error ? "#ff4d4d" : "#6c63ff")};
  margin-top: 1rem;
`;

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "email") {
      setEmail(value);
    } else if (name === "password") {
      setPassword(value);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();


    try {
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/auth/login`, { email, password });
      const { token, role } = response.data;
      
      // Store token and role in localStorage
      localStorage.setItem("authToken", token);
      localStorage.setItem("userRole", role);

      navigate(role === "admin" ? "/admin-dashboard" : "/agent-dashboard");
      }
      catch (err) {
      setMessage(err.response?.data?.msg || "An error occurred");
    }
  };

  return (
    <Container>
      <Card>
        <Title>Login</Title>
        <Form onSubmit={handleLogin}>
          <Input
            type="text"
            name="email"
            value={email}
            placeholder="Email"
            onChange={handleChange}
            required
          />
          <Input
            type="password"
            name="password"
            value={password}
            placeholder="Password"
            onChange={handleChange}
            required
          />
          <Button type="submit">Sign In</Button>
        </Form>
        {message && <Message error>{message}</Message>}
        <Link href="#">Forgot your password?</Link>
      </Card>
    </Container>
  );
};

export default LoginPage;
