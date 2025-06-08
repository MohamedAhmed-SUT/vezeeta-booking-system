import React from "react";
import "./AboutUs.css";

const AboutUs: React.FC = () => {
  return (
    <div className="container1">
      <div className="image-section1">
        <img src="/images\About-Image-1.jpg" alt="Clinic" />
      </div>
      <div className="text-section1">
        <h2>
          About <span>Us</span>
        </h2>
        <p>
          Vezeeta is the leading e-health platform for doctor booking and clinic
          management software in the Middle East and North Africa. We are
          leading the transformation of doctor, clinic, and hospital bookings
          electronically and automatically, making quality healthcare
          accessible in the Arab region.
          <br />
          With the help of over 200,000 verified and reviewed reviews, patients
          can search, compare and book with the best doctors instantly. Doctors
          can also provide a seamless and hassle-free healthcare experience
          with Vezeeta’s clinic management software.
        </p>
        <p>
          Vezeeta currently operates in Egypt, Saudi Arabia, Levant, UAE,
          Kenya, and Nigeria. We aspire to master all aspects of the healthcare
          industry and continue to launch products that make a positive
          difference in people’s lives.
        </p>
      </div>
    </div>
  );
};

export default AboutUs;