import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faInstagram,
  faTwitter,
  faFacebook,
} from "@fortawesome/free-brands-svg-icons";
import Login from "./Login";
import Register from "./Register";
import Doctors from "./Doctors";
import DoctorDetails from "./DoctorDetails";
import About from "./About";
import WhychooseUs from "./WhychooseUs";
import DoctorRegister from "./DoctorRegister";
import HeaderComponent from "./Header";
import Profile from "./Profile";
import FAQ from "./FAQ";
import AdminRoleRequestTable from "./DoctorRequests";
import AppointmentTable from "./AppointmentTable";
import PatientAppointments from "./PatientAppointments";
const Footer: React.FC = () => {
  return (
    <footer className="footer bg-primary text-white text-center py-3">
      <div className="Media">
        <a href="https://www.facebook.com/Vezeeta/" target="_blank">
          <i className="fa-brands fa-facebook"></i>
        </a>
        <a href="https://www.facebook.com/Vezeeta/" target="_blank">
          <FontAwesomeIcon icon={faFacebook} />
        </a>
        <br />
        <br />
        <a href="https://www.instagram.com/vezeeta/" target="_blank">
          <i className="fa-brands fa-instagram"></i>
        </a>
        <a href="https://www.instagram.com/vezeeta/" target="_blank">
          <FontAwesomeIcon icon={faInstagram} />
        </a>
        <br />
        <br />

        <a href="https://x.com/VEZEETA_Egypt" target="_blank">
          <i className="fa-brands fa-twitter"></i>
        </a>
        <a href="https://x.com/VEZEETA_Egypt" target="_blank">
          <FontAwesomeIcon icon={faTwitter} />
        </a>
      </div>
      <div>
        <Link to="/About" className="text-white mx-3">
          About Us
        </Link>
        <Link to="/WhychooseUs" className="text-white mx-3">
          Why choose Us
        </Link>
        <a href="/FAQ" className="text-white mx-3">
          FAQ
        </a>
        <a>&copy; 2024 Vezeeta. All Rights Reserved.</a>
      </div>
    </footer>
  );
};

const Main: React.FC = () => {
  const images: string[] = [
    "/images/img1.jpg",
    "/images/img2.jpg",
    "/images/img3.jpg",
    "/images/img4.jpg",
    "/images/img5.jpg",
  ];
  const [currentImage, setCurrentImage] = useState<string>(images[0]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prevImage) => {
        const currentIndex = images.indexOf(prevImage);
        const nextIndex = (currentIndex + 1) % images.length;
        return images[nextIndex];
      });
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  return (
    <main>
      <div>
        <div
          className="hero position-relative text-center text-white"
          style={{
            backgroundImage: `url(${currentImage})`,
            backgroundSize: "cover",
            height: "800px",
          }}
        >
          <div
            className="overlay position-absolute top-0 start-0 w-100 h-100"
            style={{ backgroundColor: "rgba(0, 0, 0, 0.3)" }}
          ></div>
          <div className="hero-content position-relative z-index-1 d-flex flex-column justify-content-center align-items-center h-100">
            <h2 className="display-4 text-white mx-3">
              Better Healthcare for a Better Life
            </h2>
          </div>
        </div>
      </div>

      <div className="download-section d-flex flex-wrap align-items-center justify-content-center    shadow-lg">
        <div className="content-container text-center px-3">
          <h2>Download the Vezeeta App</h2>
          <p>
            Search, compare, and book medical consultations easily with the
            largest network of doctors in Egypt. Order your medications and
            essentials within 60 minutes. Track your daily steps and earn points
            by achieving your daily goal.
          </p>

          <a
            href="https://play.google.com/store/apps/details?id=com.ionicframework.vezeetapatientsmobile694843&hl"
            target="_blank"
          >
            <img
              src="public\images\download2.png"
              alt="Google Play"
              style={{ width: "100%", height: "auto", borderRadius: "15px" }}
            />
          </a>
        </div>
        <div className="image-container text-center px-3">
          <img
            src="public\images\mobile.jpg"
            alt="صورة الهاتف"
            style={{
              maxWidth: "90%",
              height: "auto",
              borderRadius: "15px",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
            }}
          />
        </div>
      </div>
      <iframe
        className="download-section d-flex flex-wrap align-items-center justify-content-center  shadow-lg"
        width="12000"
        height="600"
        src="https://www.youtube.com/embed/3c2Z6C3FQgo"
      ></iframe>
    </main>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <HeaderComponent />
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/doctors" element={<Doctors />} />
        <Route path="/DoctorRegister" element={<DoctorRegister />} />
        <Route path="/doctor/:id" element={<DoctorDetails />} />
        <Route path="/About" element={<About />} />
        <Route path="/WhychooseUs" element={<WhychooseUs />} />
        <Route path="/Profile" element={<Profile />} />
        <Route path="/FAQ" element={<FAQ />} />
        <Route path="/Requests" element={<AdminRoleRequestTable />} />
        <Route path="/Appointments" element={<AppointmentTable />} />
        <Route path="/appointments/patient" element={<PatientAppointments />} />
      </Routes>
      <Footer />
    </Router>
  );
};

export default App;
