import './App.css';
import RegistrationForm from './components/registration';
import React from "react";
import LoginPage from "./components/loginPage";

const App = () => {
  return (
    <div className="App">
      <RegistrationForm />
      <LoginPage />
    </div>
  );
};

export default App;
