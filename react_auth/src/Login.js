import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Import useNavigate instead of useHistory

const containerStyle = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  height: '100vh',
  backgroundColor: '#f0f2f5',
};

const formStyle = {
  backgroundColor: '#fff',
  padding: '2rem',
  borderRadius: '8px',
  boxShadow: '0 0 15px rgba(0, 0, 0, 0.2)',
  maxWidth: '400px',
  width: '100%',
};

const labelStyle = {
  display: 'block',
  fontSize: '16px',
  fontWeight: 'bold',
  marginBottom: '0.5rem',
  textAlign: 'left',
};

const inputStyle = {
  width: '100%',
  padding: '0.8rem',
  margin: '0.5rem 0 1rem', // Margin at bottom to separate from next field
  border: '1px solid #ccc',
  borderRadius: '4px',
  boxSizing: 'border-box',
  fontSize: '16px',
  transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
};

const inputFocusStyle = {
  ...inputStyle,
  borderColor: '#007bff',
  boxShadow: '0 0 8px rgba(0, 123, 255, 0.2)',
};

const buttonStyle = {
  backgroundColor: '#007bff',
  color: '#fff',
  border: 'none',
  padding: '0.8rem',
  borderRadius: '4px',
  cursor: 'pointer',
  width: '100%',
  fontSize: '16px',
  fontWeight: 'bold',
  transition: 'background-color 0.3s ease',
};

const buttonHoverStyle = {
  ...buttonStyle,
  backgroundColor: '#0056b3',
};

const buttonActiveStyle = {
  ...buttonStyle,
  backgroundColor: '#004085',
};

const messageStyle = {
  marginTop: '1rem',
  color: '#d9534f',
  fontSize: '14px',
};

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isFocus, setIsFocus] = useState({ username: false, password: false });
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/login', { username, password });
      setMessage(`Login successful! Token: ${response.data.token}`);
      navigate('/products');
    } catch (error) {
      setMessage(error.response?.data?.message || 'An error occurred');
    }
  };

  return (
    <div style={containerStyle}>
      <div style={formStyle}>
        <h2 style={{ textAlign: 'center' }}>Login</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label style={labelStyle}>Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              style={isFocus.username ? inputFocusStyle : inputStyle}
              onFocus={() => setIsFocus({ ...isFocus, username: true })}
              onBlur={() => setIsFocus({ ...isFocus, username: false })}
            />
          </div>
          <div>
            <label style={labelStyle}>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={isFocus.password ? inputFocusStyle : inputStyle}
              onFocus={() => setIsFocus({ ...isFocus, password: true })}
              onBlur={() => setIsFocus({ ...isFocus, password: false })}
            />
          </div>
          <button
            type="submit"
            style={buttonStyle}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = buttonHoverStyle.backgroundColor}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = buttonStyle.backgroundColor}
            onMouseDown={(e) => e.currentTarget.style.backgroundColor = buttonActiveStyle.backgroundColor}
            onMouseUp={(e) => e.currentTarget.style.backgroundColor = buttonHoverStyle.backgroundColor}
          >
            Login
          </button>
        </form>
        {message && <p style={messageStyle}>{message}</p>}
      </div>
    </div>
  );
}

export default Login;
