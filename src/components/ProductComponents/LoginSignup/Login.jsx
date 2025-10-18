import "./Login.css";
import React, { useState } from "react";
import axios from "axios";
import TokenPage from "../../NewsFeedComponents/TokenPage";
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Image } from "@mantine/core";
import w4 from "./../../../assets/w4.jpg";
import slogo from "./../../../assets/Slogo.png";

const eyeclosed = "https://www.svgrepo.com/show/380007/eye-password-hide.svg";
const eyeopen = "https://www.svgrepo.com/show/380010/eye-password-show.svg";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [userId, setUserId] = useState();
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async ({ email, password }) => {
      const { data } = await axios.post(
        "http://localhost:8080/public/user/login",
        { email, password },
        { withCredentials: true }
      );
      return data;
    },
    onSuccess: (userData) => {
      console.log("✅ Login successful, FULL RESPONSE DATA:", userData);

      // Check ALL possible token locations
      const token =
        userData.token ||
        userData.jwt ||
        userData.accessToken ||
        userData.jwtToken;
      console.log("🔍 Looking for token in:", userData);
      console.log("📌 Extracted token:", token);

      if (token) {
        localStorage.setItem("jwtToken", token);
        console.log("✅ JWT token stored successfully");
      } else {
        console.warn("❌ No token found in login response!");
        console.log("Available keys in response:", Object.keys(userData));
      }

      queryClient.setQueryData(["currentUser"], userData);
      setUserId(userData.userId);
      setErrorMessage("");
      navigate("/");
    },
    onError: (error) => {
      console.error("❌ Login error:", error);
      if (error.response?.status === 409) {
        setUserId(error.response.data.userId);
        setShowModal(true);
      } else {
        setErrorMessage(error.response?.data || "Login failed");
      }
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate({ email, password });
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="login-wrapper">
      <div className="login-card">
        {/* LEFT SIDE */}
        <div className="login-left">
          <img src={slogo} alt="Silvestre Logo" className="logo-image" />
          <Image src={w4} alt="Background" className="bg-image" />
          <div className="overlay"></div>
          <div className="brand-text">Silvestre System</div>
          <div className="brand-subtitle">Secure Login</div>
        </div>

        {/* RIGHT SIDE */}
        <div className="login-right">
          <div className="login-header">
            <h2>Sign in to Silvestre</h2>
            <p className="subtitle">Enter your credentials to continue</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                value={email}
                required
                onChange={(e) => {
                  setEmail(e.target.value);
                  setErrorMessage("");
                }}
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <div className="password-container">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setErrorMessage("");
                  }}
                  className="password-input"
                  required
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={togglePasswordVisibility}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  <img
                    src={showPassword ? eyeopen : eyeclosed}
                    alt="Toggle visibility"
                  />
                </button>
              </div>
            </div>

            {errorMessage && <p className="text-error">{errorMessage}</p>}

            <button type="submit" className="submit-btn">
              Sign in
            </button>
          </form>

          {/* <div className="social-section">
            <div className="or-divider">OR</div>
            <div className="social-buttons">
              <button className="social-btn google">
                <i className="fab fa-google"></i> Login with Google
              </button>
              <button className="social-btn facebook">
                <i className="fab fa-facebook-f"></i> Login with Facebook
              </button>
            </div>
          </div> */}

          <p className="footer-text">
            Don't have an account yet?{" "}
            <strong onClick={() => navigate("/sign-up")}>Sign up now</strong>
          </p>
        </div>
      </div>

      {showModal && (
        <TokenPage
          userId={userId}
          token=""
          onClickHandler={() => setShowModal(!showModal)}
        />
      )}
    </div>
  );
};

export default Login;
