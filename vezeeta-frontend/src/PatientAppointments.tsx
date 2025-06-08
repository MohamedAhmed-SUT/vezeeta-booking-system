import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

interface Appointment {
  id: number;
  doctor_name: string;
  date: string;
  time: string;
  status: string;
  patient_id: number;
}

const PatientAppointments: React.FC = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const userToken = localStorage.getItem("token");

  useEffect(() => {
    const fetchAppointments = async () => {
      if (!userToken) {
        navigate("/login");
        return;
      }

      try {
        const userResponse = await fetch("http://127.0.0.1:8000/user/", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${userToken}`,
            "Content-Type": "application/json",
          },
        });

        if (!userResponse.ok) {
          throw new Error("Failed to fetch user data.");
        }

        const userData = await userResponse.json();
        const patientId = userData.id;

        const appointmentsResponse = await fetch(
          "http://127.0.0.1:8000/appointment/by-patient",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${userToken}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!appointmentsResponse.ok) {
          throw new Error("Failed to fetch appointments.");
        }

        const allAppointments = await appointmentsResponse.json();

        const filteredAppointments = allAppointments.filter(
          (appointment: Appointment) => appointment.patient_id === patientId
        );

        setAppointments(filteredAppointments);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, [navigate, userToken]);

  if (loading) {
    return <div>Loading appointments...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="container my-5">
      <h2 className="mb-4">My Appointments</h2>
      {appointments.length === 0 ? (
        <p>No appointments found.</p>
      ) : (
        <table className="table table-bordered">
          <thead className="thead-light">
            <tr>
              <th>#</th>
              <th>Doctor Name</th>
              <th>Date</th>
              {/* <th>Time</th> */}
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map((appointment, index) => (
              <tr key={appointment.id}>
                <td>{index + 1}</td>
                <td>{appointment.doctor_name}</td>
                <td>{appointment.date}</td>
                {/* <td>{appointment.time}</td> */}
                <td>{appointment.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default PatientAppointments;
