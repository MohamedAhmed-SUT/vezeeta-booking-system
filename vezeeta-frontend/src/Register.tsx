import React, { useState, FormEvent } from 'react';
import './login&register.css';
import { Link } from 'react-router-dom';

interface RegisterForm {
  firstName: string;
  lastName: string;
  email: string;
  gender: string;
  phoneNumber: string;
  imageUrl: string;
  medicalHistory: string;
  password: string;
  confirmPassword: string;
}

const Register: React.FC = () => {
  const [formData, setFormData] = useState<RegisterForm>({
    firstName: '',
    lastName: '',
    gender: '',
    email: '',
    phoneNumber: '',
    imageUrl: '',
    medicalHistory: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  const validateForm = async (e: FormEvent) => {
    e.preventDefault();
    const { password, confirmPassword, ...userData } = formData;

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
    } else {
      setError('');
      try {
        const response = await fetch('http://127.0.0.1:8000/user/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            first_name: userData.firstName,
            last_name: userData.lastName,
            gender: userData.gender,
            email: userData.email,
            role: 'patient',
            phone_number: userData.phoneNumber,
            image_url: userData.imageUrl || null,
            medical_history: userData.medicalHistory || null,
            password: password,
            doctor_information: {
              specialty: 'string',
              experience: 0,
              price: 0,
              rating: 0,
              location: 'string',
              waiting_time: 0,
            },
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.detail || 'Registration failed');
        }

        const data = await response.json();
        const { token } = data;
        localStorage.setItem('token', token);
        setSuccess('Registration successful!');
        setError('');
        setSuccess('Registration successful!');
        window.location.href = '/'; 

      } catch (err: any) {
        setError(err.message);
      }
    }
  };

  return (
    <div className="container12">
      <h2>Register</h2>
      <form onSubmit={validateForm}>
        <input
          type="text"
          id="firstName"
          placeholder="First Name"
          maxLength={20}
          required
          value={formData.firstName}
          onChange={handleChange}
        />
        <input
          type="text"
          id="lastName"
          placeholder="Last Name"
          maxLength={20}
          required
          value={formData.lastName}
          onChange={handleChange}
        />
        <select
          id="gender"
          required
          value={formData.gender}
          onChange={handleChange}
        >
          <option value="" disabled>Select Gender</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
        </select>
        <input
          type="email"
          id="email"
          placeholder="Email"
          required
          value={formData.email}
          onChange={handleChange}
        />
        <input
          type="tel"
          id="phoneNumber"
          placeholder="Phone Number"
          maxLength={15}
          required
          value={formData.phoneNumber}
          onChange={handleChange}
        />
        <input
          type="text"
          id="imageUrl"
          placeholder="Image URL"
          value={formData.imageUrl}
          onChange={handleChange}
        />
        <textarea
          id="medicalHistory"
          placeholder="Medical History"
          rows={3}
          value={formData.medicalHistory}
          onChange={handleChange}
        ></textarea>
        <input
          type="password"
          id="password"
          placeholder="Password"
          required
          value={formData.password}
          onChange={handleChange}
        />
        <input
          type="password"
          id="confirmPassword"
          placeholder="Confirm Password"
          required
          value={formData.confirmPassword}
          onChange={handleChange}
        />
        {error && <div id="error" className="error-message">{error}</div>}
        {success && <div id="success" className="success-message">{success}</div>}
        <button type="submit" className="btn-primary">Register</button>
        <Link to="/login" className="p-3">Login?</Link>
      </form>
    </div>
  );
};

export default Register;
