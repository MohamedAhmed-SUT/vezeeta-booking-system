import React, { useState } from 'react';
import './login&register.css';
import { useNavigate,Link } from 'react-router-dom';

const Login: React.FC = () => {
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const navigate = useNavigate(); 

  const validateForm = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const emailInput = document.getElementById('email') as HTMLInputElement;
    const passwordInput = document.getElementById('password') as HTMLInputElement;

    const email = emailInput.value;
    const password = passwordInput.value;

    try {
      const response = await fetch('http://127.0.0.1:8000/user/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('token', data.token);
        setSuccess('Login successful!');
        setError('');
        console.log('User data:', data);


        navigate('/');
        window.location.reload();
      } else {
        const errorData = await response.json();
        setError(errorData.detail || 'Login failed. Please check your credentials.');
        setSuccess('');
      }
    } catch (err) {
      setError('An error occurred. Please try again later.');
      setSuccess('');
      console.error('Error:', err);
    }
  };

  return (
    <div>
      <header className="Welcome">
        <h1>Login request in Vezeeta</h1>
        <p>Please fill in the following information so that you can add your own account.</p>
      </header>
      <section className="form-section">
        <form onSubmit={validateForm}>
          <label htmlFor="email">Email:</label>
          <input type="email" id="email" name="email" placeholder="Enter your Email" required />

          <label htmlFor="password">Password:</label>
          <input type="password" id="password" name="password" placeholder="Enter your Password" required />

          {error && <div id="error">{error}</div>}
          {success && <div id="success">{success}</div>}
          <button type="submit">Login</button>
          <Link to="/register" className="p-3">Register?</Link>
        </form>
      </section>
    </div>
  );
};

export default Login;