import React from 'react';
import './WhyChooseUs.css'; 

const WhyChooseUs: React.FC = () => {
  const cards = [
    {
      imgSrc: "images/icons8-people-100.png",
      imgAlt: "Person-Centered Care",
      title: "Person-Centered Care",
      description: "We will provide a care or treatment that is tailored to you and meets your needs and preferences."
    },
    {
      imgSrc: "images/icons8-sparkling-diamond-100 (1).png",
      imgAlt: "Dignity And Respect",
      title: "Dignity And Respect",
      description: "Our staff will treat you with dignity and respect at all times in our clinics."
    },
    {
      imgSrc: "images/icons8-heart-100.png",
      imgAlt: "Safety",
      title: "Safety",
      description: "We will provide a clean and safe environment, safe treatment, and reliable advice."
    },
    {
      imgSrc: "images/icons8-cv-100.png",
      imgAlt: "Consent",
      title: "Consent",
      description: "Before any care or treatment is given to you, we will ask you or someone legally acting on your behalf to give us your consent."
    },
    {
      imgSrc: "https://img.icons8.com/?size=100&id=dTEOBk6gnuqs&format=png&color=000000",
      imgAlt: "Premises And Equipment",
      title: "Premises And Equipment",
      description: "All our equipment is daily cleaned after each patient and calibrated annually by an external qualified engineer."
    },
    {
      imgSrc: "images/icons8-handshake-100.png",
      imgAlt: "Duty of Candour",
      title: "Duty of Candour",
      description: "We promise that we will be open and transparent with you about your care and treatment."
    }
  ];

  return (
    <div className="outer-container">
      <h2>
        Why <span>Choose Us</span>
      </h2>
      <div className="grid">
        {cards.map((card, index) => (
          <div className="card" key={index}>
            <img src={card.imgSrc} alt={card.imgAlt} />
            <h3>{card.title}</h3>
            <p>{card.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WhyChooseUs;