import React, { useState, useEffect } from 'react';
import './Doctors.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDollarSign, faLocationDot, faStethoscope,faBriefcase  } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';

interface Doctor {
  id: string;
  name: string;
  specialization: string;
  price: number;
  waitTime: string;
  rating: number;
  image: string;
  location: string;
  phone: string;
  experience: number;
  gender: string;
}

const DoctorList: React.FC = () => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [filteredDoctors, setFilteredDoctors] = useState<Doctor[]>([]);

  const [genderFilter, setGenderFilter] = useState<string>('');
  const [minPrice, setMinPrice] = useState<number | string>('');
  const [maxPrice, setMaxPrice] = useState<number | string>('');
  const [locationFilter, setLocationFilter] = useState<string>('');
  const [minRating, setMinRating] = useState<number | string>('');
  const [minExperience, setMinExperience] = useState<number | string>('');

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/doctor/');
        const data = await response.json();
        const formattedDoctors = data.map((doctor: any) => ({
          id: doctor.id,
          name: `${doctor.first_name} ${doctor.last_name}`,
          specialization: doctor.doctor_information.specialty,
          price: doctor.doctor_information.price,
          waitTime: `${doctor.doctor_information.waiting_time} min`,
          rating: doctor.doctor_information.rating,
          image: doctor.image_url,
          location: doctor.doctor_information.location,
          phone: doctor.phone_number,
          experience: doctor.doctor_information.experience,
          gender: doctor.gender,
        }));
        setDoctors(formattedDoctors);
        setFilteredDoctors(formattedDoctors);
      } catch (error) {
        console.error('Error fetching doctors:', error);
      }
    };

    fetchDoctors();
  }, []);

  // Handle filter changes
  const handleGenderFilterChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setGenderFilter(event.target.value);
  };

  const handleLocationFilterChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setLocationFilter(event.target.value);
  };

  const handleMinPriceChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMinPrice(event.target.value);
  };

  const handleMaxPriceChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMaxPrice(event.target.value);
  };

  const handleMinRatingChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMinRating(event.target.value);
  };

  const handleMinExperienceChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMinExperience(event.target.value);
  };

  const handleSortPrice = () => {
    const sortedDoctors = [...filteredDoctors].sort((a, b) => a.price - b.price);
    setFilteredDoctors(sortedDoctors);
  };

  useEffect(() => {
    const filtered = doctors.filter(doctor => {
      const matchesGender = genderFilter === '' || doctor.gender === genderFilter;
      const matchesPrice =
        (minPrice === '' || doctor.price >= Number(minPrice)) &&
        (maxPrice === '' || doctor.price <= Number(maxPrice));
      const matchesLocation = locationFilter === '' || doctor.location === locationFilter;
      const matchesRating = minRating === '' || doctor.rating >= Number(minRating);
      const matchesExperience = minExperience === '' || doctor.experience >= Number(minExperience);

      return matchesGender && matchesPrice && matchesLocation && matchesRating && matchesExperience;
    });
    setFilteredDoctors(filtered);
  }, [genderFilter, minPrice, maxPrice, locationFilter, minRating, minExperience, doctors]);

  return (
    <div className="doctor-list">
      <div className="filter-bar">
        <div className="filter-group">
          <label htmlFor="gender-filter">Gender:</label>
          <select id="gender-filter" value={genderFilter} onChange={handleGenderFilterChange}>
            <option value="">All</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </div>
        <div className="filter-group">
          <label htmlFor="location-filter">Location:</label>
          <select id="location-filter" value={locationFilter} onChange={handleLocationFilterChange}>
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
        <div className="filter-group">
          <label htmlFor="min-price">Min Price:</label>
          <input
            type="number"
            id="min-price"
            placeholder="From"
            value={minPrice}
            onChange={handleMinPriceChange}
            min="0"
          />
        </div>
        <div className="filter-group">
          <label htmlFor="max-price">Max Price:</label>
          <input
            type="number"
            id="max-price"
            placeholder="To"
            value={maxPrice}
            onChange={handleMaxPriceChange}
            min="0"
          />
        </div>
        <div className="filter-group">
          <label htmlFor="min-rating">Min Rating:</label>
          <input
            type="number"
            id="min-rating"
            placeholder="Rating"
            value={minRating}
            onChange={handleMinRatingChange}
            min="0"
            max="5"
          />
        </div>
        <div className="filter-group">
          <label htmlFor="min-experience">Min Experience:</label>
          <input
            type="number"
            id="min-experience"
            placeholder="Years"
            value={minExperience}
            onChange={handleMinExperienceChange}
            min="0"
          />
        </div>
        <div className="filter-group">
          <button id="sort-price" onClick={handleSortPrice}>Sort by Price</button>
        </div>
      </div>

      <div className="doctor-cards">
        {filteredDoctors.map(doctor => (
          <DoctorCard key={doctor.id} doctor={doctor} />
        ))}
      </div>
    </div>
  );
};

const DoctorCard: React.FC<{ doctor: Doctor }> = ({ doctor }) => {
  return (
    <div className="doctor-card">
      <img src={doctor.image} alt={doctor.name} />
      <h3>{doctor.name}</h3>
      <p className="specialization">
        <FontAwesomeIcon icon={faStethoscope} /> Specialization: {doctor.specialization}
      </p>
      <p className="rating">Rating: {doctor.rating} ★</p>
      <p className="location">
        <FontAwesomeIcon icon={faLocationDot} /> Location: {doctor.location}
      </p>
      <p className="experience">
        <FontAwesomeIcon icon={faBriefcase} /> Experience : {doctor.experience} Years
      </p>
      <p className="price">
        <FontAwesomeIcon icon={faDollarSign} /> Price: {doctor.price} EGP
      </p>
      <Link to={`/doctor/${doctor.id}`}>
        <button className="book-button">Book Now</button>
      </Link>
    </div>
  );
};

export default DoctorList;
