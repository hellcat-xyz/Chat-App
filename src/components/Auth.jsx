import React, { useState } from "react";
import Cookies from "universal-cookie";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";
const cookies = new Cookies();

const initialState = {
  username: "",
  email: "",
  password: "",
  confirmPassword: "",
};

const Auth = ({ onAuth }) => {
  const [isSignup, setIsSignup] = useState(false);
  const [form, setForm] = useState(initialState);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const switchMode = () => {
    setError("");
    setForm(initialState);
    setIsSignup((prevIsSignup) => !prevIsSignup);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    const { username, email, password, confirmPassword } = form;
    const endpoint = isSignup ? "/auth/register" : "/auth/login";
    const requestBody = isSignup
      ? { email, username, password, confirmPass: confirmPassword }
      : { email, password };

    try {
      const { data } = await axios.post(`${API_URL}${endpoint}`, requestBody);

      if (isSignup && !data.token) {
        setIsSignup(false);
        setForm({ ...initialState, email });
        setError("Account created. Sign in with your email and password.");
        return;
      }

      cookies.set("token", data.token, { path: "/" });
      cookies.set("email", email, { path: "/" });
      onAuth(data.token);
    } catch (err) {
      const responseError = err.response?.data?.error || err.response?.data;
      setError(typeof responseError === "string" ? responseError : "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth__form-container">
      <div className="auth__form-container_fields">
        <div className="auth__form-container_fields-content">
          <p>{isSignup ? "Sign Up" : "Sign In"}</p>
          <form onSubmit={handleSubmit}>
            {isSignup && (
              <div className="auth__form-container_fields-content_input">
                <label htmlFor="username">Username</label>
                <input
                  id="username"
                  name="username"
                  type="text"
                  placeholder="Username"
                  value={form.username}
                  onChange={handleChange}
                  required
                />
              </div>
            )}
            <div className="auth__form-container_fields-content_input">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="Email"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="auth__form-container_fields-content_input">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                placeholder="Password"
                value={form.password}
                onChange={handleChange}
                required
              />
            </div>
            {isSignup && (
              <div className="auth__form-container_fields-content_input">
                <label htmlFor="confirmPassword">Confirm Password</label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  placeholder="Confirm Password"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  required
                />
              </div>
            )}
            {error && <div className="auth__form-error">{error}</div>}
            <div className="auth__form-container_fields-content_button">
              <button disabled={submitting}>{submitting ? "Please wait..." : isSignup ? "Sign Up" : "Sign In"}</button>
            </div>
          </form>
          <div className="auth__form-container_fields-account">
            <p style={{ fontSize: "14px" }}>
              {isSignup ? "Already have an account?" : "Don't have an account?"}
              <button type="button" onClick={switchMode}>
                {isSignup ? "Sign In" : "Sign Up"}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
