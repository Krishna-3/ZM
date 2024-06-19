import React, { useState } from 'react';
import axios from '../api/axios'
import styled from 'styled-components';

const FormContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f5f5f5;
`;

const FormWrapper = styled.div`
  background-color: white;
  padding: 40px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  width: 400px;
`;

const FormTitle = styled.h2`
  text-align: center;
  margin-bottom: 30px;
`;

const FormGroup = styled.div`
  margin-bottom: 20px;
`;

const FormLabel = styled.label`
  display: block;
  font-weight: bold;
  margin-bottom: 5px;
`;

const FormInput = styled.input`
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 16px;
`;

const FormSelect = styled.select`
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 16px;
`;

const ErrorMessage = styled.p`
  color: red;
  margin-top: 5px;
`;

const SubmitButton = styled.button`
  display: block;
  width: 100%;
  padding: 10px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;

  &:hover {
    background-color: #0056b3;
  }
`;

const RegistrationForm = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [username, setUsername] = useState('');
  const [gender, setGender] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (password !== confirmPassword) {
      setError('Passwords do not match');
    } else if (!validateEmail(email) || password.length < 8) {
      setError('Invalid email address');
    } else if (!validateMobile(mobile) || mobile.length !== 10) {
      setError('Invalid mobile number');
    } else {
      try {
        const response = await axios.post('/signup', JSON.stringify({ username, password, firstName, lastName, mail: email, mobile, gender }));
        const res = response?.data;
        console.log(res);
        setUsername('');
        setPassword('');
      } catch (err) {
        setError(err)
      }
      setFirstName('');
      setLastName('');
      setEmail('');
      setMobile('');
      setUsername('');
      setGender('');
      setPassword('');
      setConfirmPassword('');
      setError(null);
    }
  };

  const validateEmail = (email) => {
    const re = /^[a-zA-Z0-9-.]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*$/gm;
    return re.test(email);
  };

  const validateMobile = (mobile) => {
    const re = /^[0-9]{10}$/;
    return re.test(mobile);
  };

  return (
    <FormContainer>
      <FormWrapper>
        <FormTitle>Registration Form</FormTitle>
        <form onSubmit={handleSubmit}>
          <FormGroup>
            <FormLabel>First Name:</FormLabel>
            <FormInput
              type="text"
              value={firstName}
              onChange={(event) => setFirstName(event.target.value)}
              required
            />
          </FormGroup>
          <FormGroup>
            <FormLabel>Last Name:</FormLabel>
            <FormInput
              type="text"
              value={lastName}
              onChange={(event) => setLastName(event.target.value)}
              required
            />
          </FormGroup>
          <FormGroup>
            <FormLabel>Email:</FormLabel>
            <FormInput
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </FormGroup>
          <FormGroup>
            <FormLabel>Mobile:</FormLabel>
            <FormInput
              type="tel"
              value={mobile}
              onChange={(event) => setMobile(event.target.value)}
              required
            />
          </FormGroup>

          <FormGroup>
            <FormLabel>Gender:</FormLabel>
            <FormSelect
              value={gender}
              onChange={(event) => setGender(event.target.value)}
              required
            >
              <option value="">Select Gender</option>
              <option value="M">Male</option>
              <option value="F">Female</option>
            </FormSelect>
          </FormGroup>
          <FormGroup>
            <FormLabel>Username:</FormLabel>
            <FormInput
              type="text"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              required
            />
          </FormGroup>
          <FormGroup>
            <FormLabel>Password:</FormLabel>
            <FormInput
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
          </FormGroup>
          <FormGroup>
            <FormLabel>Confirm Password:</FormLabel>
            <FormInput
              type="password"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              required
            />
          </FormGroup>
          {error && <ErrorMessage>{error}</ErrorMessage>}
          <SubmitButton type="submit">Register</SubmitButton>
        </form>
      </FormWrapper>
    </FormContainer>
  );
}

export default RegistrationForm;