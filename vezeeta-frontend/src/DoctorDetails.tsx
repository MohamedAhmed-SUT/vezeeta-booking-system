import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faDollarSign,
  faLocationDot,
  faStar,
  faStethoscope,
  faClock,
  faBriefcase
} from "@fortawesome/free-solid-svg-icons";
import "./DoctorDetails.css";

interface DoctorDetailsData {
  first_name: string;
  last_name: string;
  gender: string;
  email: string;
  image_url: string;
  phone_number: string;
  medical_history: string;
  doctor_information: {
    specialty: string;
    experience: number;
    price: number;
    rating: number;
    location: string;
    waiting_time: number;
  };
}

const getFormattedDate = (offset: number): string => {
  const today = new Date();
  today.setDate(today.getDate() + offset);
  const options: Intl.DateTimeFormatOptions = {
    weekday: "long",
    day: "numeric",
    month: "long",
  };
  return today.toLocaleDateString("en-US", options);
};

const DoctorDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [doctorDetails, setDoctorDetails] = useState<DoctorDetailsData | null>(
    null
  );
  const [days, setDays] = useState<any[]>([]);
  const [comment, setComment] = useState<string>("");
  const [rating, setRating] = useState<number>(0);
  const [isAngry, setIsAngry] = useState<boolean>(false);

  const handleCommentChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setComment(event.target.value);
  };

  const handleReviewSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    const token = localStorage.getItem("token");
    event.preventDefault();
    try {
      const response = await fetch("http://127.0.0.1:8000/review/setReview", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          doctor_id: id,
          rating: rating,
          comment: comment,
          angry: isAngry,
        }),
      });
      const data = await response.json();
      console.log(data);
      // Reset form
      setComment("");
      setRating(0);
      setIsAngry(false);
    } catch (error) {
      console.error("Error submitting review:", error);
    }
  };
  const handleBookAppointment = async (day: any) => {
    const token = localStorage.getItem("token");
    if (!day) {
      alert("Please choose a day for the appointment");
      return;
    }
    try {
      debugger;
      const response = await fetch(`http://127.0.0.1:8000/appointment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          doctor_id: id,
          date: day.date,
        }),
      });
      const data = await response.json();
      console.log(data);
      alert("Appointment booked successfully!");
    } catch (error) {
      console.error("Error booking appointment:", error);
      alert("Error booking appointment, please try again");
    }
  };
  useEffect(() => {
    console.log(rating);
    const fetchDoctorDetails = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:8000/doctor/${id}`);
        const data = await response.json();
        setDoctorDetails(data);
      } catch (error) {
        console.error("Error fetching doctor details:", error);
      }
    };

    if (id) {
      fetchDoctorDetails();
    }
  }, [id]);

  useEffect(() => {
    const daysData = [
      {
        label: "Today",
        date: getFormattedDate(0),
        times: ["10:00 AM - 12:00 PM", "04:00 PM - 06:00 PM"],
      },
      {
        label: "Tomorrow",
        date: getFormattedDate(1),
        times: ["11:00 AM - 01:00 PM", "05:00 PM - 07:00 PM"],
      },
      {
        label: "Day After Tomorrow",
        date: getFormattedDate(2),
        times: ["12:00 PM - 02:00 PM", "06:00 PM - 08:00 PM"],
      },
    ];

    setDays(daysData);
  }, []);

  if (!doctorDetails) {
    return <p>Loading...</p>;
  }

  const { first_name, last_name, image_url, doctor_information } =
    doctorDetails;
  const {
    specialty,
    experience,
    price,
    rating: doctorRating,
    location,
    waiting_time,
  } = doctor_information;

  return (
    <div className="doctor-details-container">
      <div className="header1">
        <h1>Doctor Details</h1>
      </div>
      <div className="container1">
        <div className="doctor-info">
          <div className="image">
            <img src={image_url} alt={`${first_name} ${last_name}`} />
          </div>
          <div className="details">
            <h2>{`${first_name} ${last_name}`}</h2>
            <p>
              <FontAwesomeIcon icon={faStethoscope} />{" "}
              <strong>Specialization:</strong> {specialty}
            </p>
            <p>
            <FontAwesomeIcon icon={faBriefcase} /> <strong>Experience:</strong> {experience} years
            </p>
            <p>
              <FontAwesomeIcon icon={faLocationDot} />{" "}
              <strong>Location:</strong> {location}
            </p>
            <p>
              <FontAwesomeIcon icon={faDollarSign} /> <strong>Price:</strong>{" "}
              {price} EGP
            </p>
            <p className="rating">
              <FontAwesomeIcon icon={faStar} /> <strong>Rating:</strong>{" "}
              {doctorRating.toFixed(1)}
            </p>
            <p>
              <FontAwesomeIcon icon={faClock} /> <strong>Wait Time:</strong>{" "}
              {waiting_time} minutes
            </p>
          </div>
        </div>

        <div className="booking-info">
          <h3>Select an Appointment:</h3>
          <div className="price-wait">
            <p>
              <FontAwesomeIcon icon={faDollarSign} /> Price: {price} EGP
              <br />
              <FontAwesomeIcon icon={faClock} /> Wait Time: {waiting_time}{" "}
              minutes
            </p>
          </div>

          <div className="dates" id="dates-container">
            {days.map((day, index) => (
              <div key={index} className="date">
                <h4>{`${day.label} (${day.date})`}</h4>
                <ul>
                  {day.times.map((time, idx) => (
                    <li key={idx}>{time}</li>
                  ))}
                </ul>
                <button
                  className="btn1"
                  onClick={() => handleBookAppointment(day)}
                >
                  Book Now
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="starContainer">
        <h3>Add a Review:</h3>
        <div className="add-review">
          <form onSubmit={handleReviewSubmit}>
            <div className="rating">
              <label>Rating:</label>
              <div className="star-rating">
                {[1, 2, 3, 4, 5].map((star) => (
                  <FontAwesomeIcon
                    key={star}
                    icon={faStar}
                    className={star <= rating ? "star active" : "star"}
                    onClick={() => {
                      setRating(star);
                      setIsAngry(star < 3);
                    }}
                  />
                ))}
              </div>
            </div>
            <div className="comment">
              <label>
                Comment:
                <textarea value={comment} onChange={handleCommentChange} />
              </label>
            </div>
            <button type="submit" className="btn1" disabled={rating === 0}>
              Post Review
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default DoctorDetails;
