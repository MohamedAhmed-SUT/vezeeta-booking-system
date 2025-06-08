import React from "react";
import "./AboutUs.css";

const FAQ: React.FC = () => {
  return (
    <div className="container1">
      <div className="image-section1">
        <img src="\images\favicon.png" alt="Clinic" />
      </div>
      <div className="text-section1">
        <h2>
          Frequently Asked <span>Questions</span>
        </h2>
        <div className="faq-item">
          <h3>How do I book an appointment with a doctor?</h3>
          <p>
            You can select a doctor from the list based on their specialty, location, and ratings. Click the "Book Appointment" button, then choose a suitable time and date.
          </p>
        </div>
        <div className="faq-item">
          <h3>Can I cancel or reschedule my appointment?</h3>
          <p>
            Yes, you can cancel or reschedule your appointment through the "My Appointments" section in the app, as long as it’s done at least 24 hours before the appointment.
          </p>
        </div>
        <div className="faq-item">
          <h3>Can I consult a doctor online?</h3>
          <p>
            Yes, the app offers online consultations for certain specialties. You can book a video consultation and connect with the doctor remotely.
          </p>
        </div>
        <div className="faq-item">
          <h3>How do I choose the right doctor?</h3>
          <p>
            You can read patient reviews, check the doctor's years of experience, and view the consultation cost to make an informed decision.
          </p>
        </div>
        <div className="faq-item">
          <h3>Is my data secure?</h3>
          <p>
            Absolutely. We are committed to protecting your privacy. All your data is encrypted and used solely to improve your booking and healthcare experience.
          </p>
        </div>
        <div className="faq-item">
          <h3>How can I provide feedback or file a complaint?</h3>
          <p>
            You can share feedback or file a complaint through the "Contact Us" section in the app, and we will respond promptly.
          </p>
        </div>
        <div className="faq-item">
          <h3>What is the consultation fee?</h3>
          <p>
            Fees vary depending on the doctor and specialty. You can view the exact cost on the doctor's profile before booking.
          </p>
        </div>
        <div className="faq-item">
          <h3>Are there discounts on consultations?</h3>
          <p>
            Yes, we offer exclusive discounts on certain doctors and specialties. Check the "Offers" section in the app for updates.
          </p>
        </div>
        <div className="faq-item">
          <h3>Can I access my medical history?</h3>
          <p>
            Yes, you can view your past visits and prescribed medications in the "Medical History" section of the app.
          </p>
        </div>
        <div className="faq-item">
          <h3>What should I do if I cannot reach my doctor?</h3>
          <p>
            If you face any issues connecting with your doctor, contact our customer support team via the app for assistance.
          </p>
        </div>
        <div className="faq-item">
          <h3>Is technical support available 24/7?</h3>
          <p>
            Yes, our technical support team is available around the clock to help you with any inquiries or issues.
          </p>
        </div>
        <div className="faq-item">
          <h3>Can I rate and review my doctor after the appointment?</h3>
          <p>
            Yes, after your appointment, you can leave a rating and review based on your experience to help other patients choose the right doctor.
          </p>
        </div>
        <div className="faq-item">
          <h3>Can I book appointments for multiple people at once?</h3>
          <p>
            Yes, you can book multiple appointments for yourself and your family members by selecting the appropriate profiles during booking.
          </p>
        </div>
        <div className="faq-item">
          <h3>Do I need to bring anything to the appointment?</h3>
          <p>
            Bring any relevant medical documents, previous prescriptions, or test results to help the doctor better understand your case.
          </p>
        </div>
        <div className="faq-item">
          <h3>How do I know the doctor’s availability?</h3>
          <p>
            The doctor’s schedule is displayed on their profile, showing available dates and time slots for booking.
          </p>
        </div>
        <div className="faq-item">
          <h3>How can I track my test results?</h3>
          <p>
            If you booked your test through the app, you can track its progress and view results in the "Test Results" section.
          </p>
        </div>
        <div className="faq-item">
          <h3>Can I request a female or male doctor?</h3>
          <p>
            Yes, you can filter doctors by gender preference during your search.
          </p>
        </div>
      </div>
    </div>
  );
};

export default FAQ;