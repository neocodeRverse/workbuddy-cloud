import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setUserInfo } from "../userSlice";
import "./Login.css";
import API_BASE_URL from "../apiConfig";

function Login() {
  useEffect(() => {
    localStorage.setItem("token", "");
  }, []);

  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    email: "",
    password: "", // Use "email" instead of "username"
  });
  const dispatch = useDispatch();

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    validateField(name, value);
  };

  const validateField = (fieldName, value) => {
    const fieldErrors = { ...errors };

    switch (fieldName) {
      case "email":
        fieldErrors.email = value.match(/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/)
          ? ""
          : "Please enter a valid email";
        break;
      case "password":
        fieldErrors.password =
          value.length >= 6 ? "" : "Password must be at least 6 characters";
        break;
      default:
        break;
    }

    setErrors(fieldErrors);
  };

  async function handleLogin() {
    setError("");
    console.log("Login clicked");

    const fieldErrors = { ...errors };

    if (
      formData.email.trim() === "" ||
      formData.password.trim() === "" ||
      fieldErrors.email.trim() !== "" ||
      fieldErrors.password.trim() !== ""
    ) {
      setErrors({
        email: formData.email.trim() === "" ? "Email is required" : fieldErrors.email,
        password:
          formData.password.trim() === ""
            ? "Password is required"
            : fieldErrors.password,
      });
      return;
    } else {
      try {
        let requestObject = {
          Email: formData.email,
          Password: formData.password,
        };

        console.log("requestObject", requestObject);

        const response = await axios.post(
          API_BASE_URL+"/api/login",
          requestObject
        );

        console.log("response in login", response);

        if (response.status === 200) {
          localStorage.setItem("isAuthenticated", "true");
          localStorage.setItem("token", response.data.token);
          localStorage.setItem("userRole", response.data.role);
          localStorage.setItem("userName", response.data.userName);
          localStorage.setItem("userId", response.data.userId);
    

          let userData = {
            role: response.data.role,
            userId: response.data.id,
            userName: response.data.userName,
            isAuthenticated: true,
          };
          console.log("userData", userData);
          dispatch(setUserInfo(userData));

          if (response.data.role === "Employee") {
            navigate("/home");
          } else {
            navigate("/home");
          }
        } else {
          setError("Invalid Email or Password");
        }
      } catch (error) {
        console.log(error);
        setError("Invalid Email or Password");
      }
    }
  }

  return (
    <div className="login-container">
      <div className="login-wrapper">
        <div className="login-right">
          <div id="message">
           <h2>WorkBuddy</h2>
           <p>Success at work is a journey, and the first step is managing your tasks effectively</p>
          </div>
        </div>
        <div className="login-left">
          <div className="login-box">
            <h2>Login</h2>
            <div className="form-group">
              
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email"
              />
              {errors.email && <div className="error">{errors.email}</div>}
            </div>
            <div className="form-group">
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Password"
              />
              {errors.password && <div className="error">{errors.password}</div>}
            </div>
            {error && <div className="error">{error}</div>}
            <button type="submit" className="login-button" onClick={handleLogin}>
              Login
            </button>
            <div className="signup-link">
              Don't have an account? <Link to="/user/register">Signup</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
