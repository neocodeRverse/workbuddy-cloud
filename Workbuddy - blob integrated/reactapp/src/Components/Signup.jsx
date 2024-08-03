import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import "./Signup.css";
import API_BASE_URL from '../apiConfig';

function Signup() {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [successPopup, setSuccessPopup] = useState(false);

  const [formData, setFormData] = useState({
    Username: '',
    Email: '',
    MobileNumber: '',
    Password: '', 
    ConfirmPassword: '', 
    UserRole: 'Educator',
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    validateField(name, value);
  }

  const validateField = (fieldName, value) => {
    const fieldErrors = { ...errors };

    switch (fieldName) {
      case 'Email':
        fieldErrors.Email = value.match(/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/)
          ? '' : 'Please enter a valid email';
        break;
      case 'MobileNumber':
        fieldErrors.MobileNumber = value.match(/^[0-9]{10}$/) ? '' : 'Mobile number must be 10 digits';
        break;
      case 'Password':
        fieldErrors.Password = value.length >= 6 ? '' : 'Password must be at least 6 characters';
        break;
      case 'ConfirmPassword':
        fieldErrors.ConfirmPassword =
          value === formData.Password ? '' : 'Passwords do not match';
        break;
      default:
        break;
    }

    setErrors(fieldErrors);
  }

  async function handleSubmit() {
    const fieldErrors = { ...errors };

    if (formData.Username.trim() === '') {
      fieldErrors.Username = 'User Name is required';
    } else {
      fieldErrors.Username = '';
    }
    if (formData.Email.trim() === '') {
      fieldErrors.Email = 'Email is required';
    } else {
      fieldErrors.Email = '';
    }
    if (formData.MobileNumber.trim() === '') {
      fieldErrors.MobileNumber = 'Mobile Number is required';
    } else {
      fieldErrors.MobileNumber = '';
    }
    if (formData.Password === '') {
      fieldErrors.Password = 'Password is required';
    } else if (fieldErrors.Password.trim() !== '') {
      fieldErrors.Password = fieldErrors.Password;
    } else {
      fieldErrors.Password = '';
    }
    if (formData.ConfirmPassword === '') {
      fieldErrors.ConfirmPassword = 'Confirm Password is required';
    } else if (formData.ConfirmPassword !== formData.Password) {
      fieldErrors.ConfirmPassword = 'Passwords do not match';
    } else {
      fieldErrors.ConfirmPassword = '';
    }

    setErrors(fieldErrors);

    const hasErrors = Object.values(fieldErrors).some((error) => error !== '');
    if (!hasErrors) {
      let requestObject = {
        "Username": formData.Username,
        "Email": formData.Email,
        "MobileNumber": formData.MobileNumber,
        "Password": formData.Password,
        "UserRole": formData.UserRole
      }

      try {
        const response = await axios.post(
          API_BASE_URL+'/api/register',
          requestObject,
        );

        if (response.status === 200) {
          setSuccessPopup(true);
        } else {
          setError("Something went wrong, Please try with different data");
        }
      } catch (error) {
        console.error("Error in signup:", error);
        setError("Something went wrong, Please try with different data");
      }
    }
  }

  function handleSuccessMessage() {
    setSuccessPopup(false);
    navigate("/user/login");
  }

  return (
    <div>
      <div className={`signup-form-container ${successPopup ? "blur" : ""}`}>
        <div>
          <h2>Signup</h2>
        </div>
        <div className="signup-form">
          <div className="form-group">
            <label htmlFor="Username">User Name <span className="required-asterisk">*</span></label>
            <input
              type="text"
              name="Username"
              value={formData.Username}
              onChange={handleChange}
              placeholder="Username"
            />
            {errors.Username && <div className="error">{errors.Username}</div>}
          </div>
          <div className="form-group">
            <label htmlFor="Email">Email <span className="required-asterisk">*</span></label>
            <input
              type="email"
              name="Email"
              value={formData.Email}
              onChange={handleChange}
              placeholder="Email"
            />
            {errors.Email && <div className="error">{errors.Email}</div>}
          </div>
          <div className="form-group">
            <label htmlFor="MobileNumber">Mobile Number<span className="required-asterisk">*</span></label>
            <input
              type="text"
              name="MobileNumber"
              value={formData.MobileNumber}
              onChange={handleChange}
              placeholder="Mobile Number"
            />
            {errors.MobileNumber && <div className="error">{errors.MobileNumber}</div>}
          </div>
          <div className="form-group">
            <label htmlFor="Password">Password <span className="required-asterisk">*</span></label>
            <input
              type="password"
              name="Password"
              value={formData.Password}
              onChange={handleChange}
              placeholder="Password"
            />
            {errors.Password && <div className="error">{errors.Password}</div>}
          </div>
          <div className="form-group">
            <label htmlFor="ConfirmPassword">Confirm Password <span className="required-asterisk">*</span></label>
            <input
              type="password"
              name="ConfirmPassword"
              value={formData.ConfirmPassword}
              onChange={handleChange}
              placeholder="Confirm Password"
            />
            {errors.ConfirmPassword && <div className="error">{errors.ConfirmPassword}</div>}
          </div>
          <div className="form-group">
            <label htmlFor="UserRole">Role<span className="required-asterisk">*</span></label>
            <select id="UserRole" name="UserRole" value={formData.UserRole} onChange={handleChange}>
              <option value="">Select Role</option>
              <option value="Employee">Employee</option>
              <option value="Manager">Manager</option>
            </select>
          </div>
          {error && <span id="login_error">{error}</span>}
          <button type="submit" className="submit-button" onClick={handleSubmit}>
            Submit
          </button>
          <div className="login-link">
            Already have an Account? <Link to="/user/login">Login</Link>
          </div>
        </div>
      </div>
      {successPopup && (
        <div className="success-popup">
          <p>User Registration is Successful!</p>
          <button onClick={handleSuccessMessage}>Ok</button>
        </div>
      )}
    </div>
  );
}

export default Signup;
