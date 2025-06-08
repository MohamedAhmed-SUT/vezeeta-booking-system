import React, { useState } from "react";
import "./login&register.css";
import { useNavigate } from "react-router-dom";

const DoctorRegistration: React.FC = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    specialty: "",
    location: "",
    waiting_time: 0,
    experience: 0,
    price: 0.0,
    rating: 0.0,
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { id, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [id]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    const requestMessage = {
      doctor_data: formData,
      request_message: "becoming a higher man",
    };
    fetch("http://127.0.0.1:8000/request", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(requestMessage),
    })
      .then((res) => res.json())
      .then((data) => console.log(data))
      .catch((err) => console.error(err))
      .finally(() => navigate("/"));
    console.log("Form Submitted", formData);
  };

  return (
    <div className="container12">
      <h2>Doctor Registration</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="specialty">Specialty</label>
          <select
            id="specialty"
            value={formData.specialty}
            onChange={handleInputChange}
          >
            <option value="">Select your specialty</option>
            <option>Cardiology</option>
            <option>Dermatology</option>
            <option>Neurology</option>
            <option>Pediatrics</option>
            <option>Orthopedics</option>
            <option>Ophthalmology</option>
            <option>Psychiatry</option>
            <option>Gynecology</option>
            <option>General Surgery</option>
            <option>Internal Medicine</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="location">Location</label>
          <select
            id="location"
            value={formData.location}
            onChange={handleInputChange}
          >
            <option value="">Select clinic location</option>
            <option>Nasr City</option>
            <option>Heliopolis</option>
            <option>Maadi</option>
            <option>Dokki</option>
            <option>Mohandessin</option>
            <option>New Cairo</option>
            <option>Garden City</option>
            <option>Zamalek</option>
            <option>Shubra</option>
            <option>6th of October</option>
            <option>El Rehab</option>
            <option>El Marg</option>
            <option>Katameya</option>
            <option>Badr City</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="waiting_time">Waiting Time (Minutes)</label>
          <input
            type="number"
            id="waiting_time"
            placeholder="Enter average waiting time"
            value={formData.waiting_time}
            onChange={handleInputChange}
            min="0"
          />
        </div>

        <div className="form-group">
          <label htmlFor="experience">Experience (Years)</label>
          <input
            type="number"
            id="experience"
            placeholder="Enter years of experience"
            value={formData.experience}
            onChange={handleInputChange}
            min="0"
          />
        </div>

        <div className="form-group">
          <label htmlFor="price">Price ($)</label>
          <input
            type="number"
            id="price"
            placeholder="Enter consultation price"
            value={formData.price}
            onChange={handleInputChange}
            min="0"
          />
        </div>
        <button type="submit" className="submit-button">
          Submit
        </button>
      </form>
    </div>
  );
};

export default DoctorRegistration;
