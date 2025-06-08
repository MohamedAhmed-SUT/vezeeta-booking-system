import React, { useState, useEffect } from "react";
import "./AppointmentTable.css";

interface AppointmentResponseSchema {
  id: string; 
  patient_id: string;
  patient_name: string;
  doctor_name: string;
  doctor_id: string;
  date: string;
  status: string;
}

const AppointmentTable: React.FC = () => {
  const [appointments, setAppointments] = useState<AppointmentResponseSchema[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    const token = localStorage.getItem("token");

    try {
      const response = await fetch("http://127.0.0.1:8000/appointment/", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        setAppointments(data);
      } else {
        setError("Failed to fetch appointments data. Please try again.");
      }
    } catch (error) {
      setError("An error occurred while fetching the appointment data.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async (id: string) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://127.0.0.1:8000/appointment/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: "accepted" }),
      });
      if (!response.ok) {
        throw new Error("Failed to accept appointment");
      }
      setAppointments(
        appointments.map((appointment) =>
          appointment.id === id
            ? { ...appointment, status: "accepted" }
            : appointment
        )
      );
    } catch (err) {
      setError("Failed to accept appointment. Please try again.");
    }
  };

  const handleDelete = async (id: string) => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(`http://127.0.0.1:8000/appointment/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        throw new Error("Failed to delete appointment");
      }
      setAppointments(
        appointments.filter((appointment) => appointment.id !== id)
      );
    } catch (err) {
      setError("Failed to delete appointment. Please try again.");
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  if (!appointments || appointments.length === 0) {
    return (
      <div className="no-appointments">No appointments at the moment.</div>
    );
  }

  return (
    <div className="tableContainer">
      <table className="table">
        <thead>
          <tr>
            <th>Patient Name</th>
            <th>Date</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {appointments.map((appointment) => (
            <tr key={appointment.id}>
              <td>{appointment.patient_name}</td>
              <td>{appointment.date}</td>
              <td>{appointment.status}</td>
              <td>
                <button
                  className="acceptButton"
                  onClick={() => handleAccept(appointment.id)}
                  hidden={appointment.status === "accepted"}
                >
                  Accept
                </button>
                <button
                  className="deleteButton"
                  onClick={() => handleDelete(appointment.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AppointmentTable;
