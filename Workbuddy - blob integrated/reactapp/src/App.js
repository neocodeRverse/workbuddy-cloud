import React from 'react';
import Login from './Components/Login';
import HomePage from './Components/HomePage';
import SignupForm from './Components/Signup';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import PrivateRoute from './Components/PrivateRoute'; // Import the PrivateRoute component
import { Navigate } from 'react-router-dom';
import ErrorPage from './Components/ErrorPage';
import LeaveForm from './EmployeeComponents/LeaveForm';
import ViewLeave from './EmployeeComponents/ViewLeave';
import LeaveRequests from './ManagerComponents/LeaveRequest';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="user">
          <Route path="login" element={<Login />} />
          <Route path="register" element={<SignupForm />} />
        </Route>
        <Route path="/home"  element={  <PrivateRoute>  <HomePage /> </PrivateRoute>}/>   
        <Route path="/newleave/:id?" element={ <PrivateRoute> <LeaveForm /> </PrivateRoute>}  />
        <Route path="/employee/view/leave" element={ <PrivateRoute> <ViewLeave /> </PrivateRoute>}  />
        <Route path="*" element={<Navigate to="/user/login" replace />} />     
        <Route path="/manager/view/leave" element={ <PrivateRoute> <LeaveRequests /> </PrivateRoute>}  />
        <Route path="/error"  element={<ErrorPage/> }/>  

     </Routes>
    </BrowserRouter>
  );
}

export default App;
