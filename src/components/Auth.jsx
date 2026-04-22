import React, { useState } from 'react';
import Cookies from 'universal-cookie';
import axios from 'axios';

const cookies = new Cookies();

const initialState = {
  fullName: '',
  username: '',
  email: '',
  password: '',
  confirmPassword: '',
}

const Auth = () => {
  const [isSignup, setIsSignup] = useState(false);
  const [form, setForm] = useState(initialState);

  const switchMode = () => {
    setIsSignup((prevIsSignup) => !prevIsSignup);
  }

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { fullName, username, email, password } = form;
    const URL = 'http://localhost:5000/auth';
    const { data: { token, userId, hashedPassword } } = await axios.post(`${URL}/${isSignup ? 'signup' : 'login'}`, {
      fullName,
      username,
      email,
      password,
    });

    cookies.set('token', token);
    cookies.set('username', username);
    cookies.set('fullName', fullName);
    cookies.set('userId', userId);
    cookies.set('email', email);

    if(isSignup) {
      cookies.set('hashedPassword', hashedPassword);
    }

    window.location.reload();
  }

  return (
    <div className='auth__form-container'>
      <div className='auth___form-container_fields'>
        <div className='auth__form-container_fields-content'> 
          <p>{isSignup ? 'Sign Up' : 'Sign In' }</p>
          <form onSubmit={handleSubmit}>
            {isSignup && (
              <div className='auth__form-container_fields-content_input'>
              <label htmlFor="fullName">Full Name</label>
              <input name="fullName"
              type="text"
              placeholder="Full Name"
              onChange={handleChange}
              required
              />
              </div>
            )}
            <div className='auth__form-container_fields-content_input'>
              <label htmlFor="fullName">Username</label>
              <input name="username"
              type="text"
              placeholder="Username"
              onChange={handleChange}
              required
              />
              </div>
              {isSignup && (
              <div className='auth__form-container_fields-content_input'>
              <label htmlFor="email">Email</label>
              <input name="email"
              type="email"
              placeholder="Email"
              onChange={handleChange}
              required
              />
              </div>
            )}
            <div className='auth__form-container_fields-content_input'>
              <label htmlFor="password">Password</label>
              <input name="password"
              type="password"
              placeholder="Password"
              onChange={handleChange}
              required
              />
              </div>
              {isSignup && (
              <div className='auth__form-container_fields-content_input'>
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input name="confirmPassword"
              type="password"
              placeholder="Confirm Password"
              onChange={handleChange}
              required
              />
              </div>
            )}
            <div className='auth__form-container_fields-content_button'>
              <button>{isSignup ? 'Sign Up' : 'Sign In'}</button>
            </div>
          </form>
          <div className='auth__form-container_fiels-account'>
            <p style={{ fontSize: "14px" }}>
              {isSignup
              ? "Already have an account?"
             : "Don't have an account?"
             }
             <span onClick={switchMode} style={{ color: "#a78bfa" }}>
              {isSignup ? ' Sign In' : ' Sign Up'}
             </span>
            </p>
          </div>
        </div>
      </div>
      
    </div>
  )
}

export default Auth
