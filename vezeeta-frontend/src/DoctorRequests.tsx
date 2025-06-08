import React, { useState, useEffect } from "react";
import "./DoctorRequests.css";

export interface DoctorSchema {
  role: "doctor";
  specialty: string;
  price: number;
  experience: number;
  rating: number;
  location: string;
  waiting_time: number;
}

export interface RoleRequestResponseSchema {
  id: string;
  requesterid: string;
  requester_name: string;
  request_date: string;
  doctor_data: DoctorSchema;
  request_message: string;
}

const AdminRoleRequestTable: React.FC = () => {
  const [requests, setRequests] = useState<RoleRequestResponseSchema[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    const token = localStorage.getItem("token");

    try {
      const response = await fetch("http://127.0.0.1:8000/request/", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        setRequests(data);
      } else {
        setError("Failed to fetch requests data. Please try again.");
      }
    } catch (error) {
      setError("An error occurred while fetching the request data.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id: string) => {
    try {
      const token = localStorage.getItem("token");
      debugger;
      const response = await fetch(
        `http://127.0.0.1:8000/request/approve/${id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (!response.ok) {
        throw new Error("Failed to approve request");
      }
      // Remove the approved request from the list
      setRequests(requests.filter((request) => request.id !== id));
    } catch (err) {
      setError("Failed to approve request. Please try again.");
    }
  };

  const handleDeny = async (id: string) => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(`http://127.0.0.1:8000/request/deny/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        throw new Error("Failed to deny request");
      }
      setRequests(requests.filter((request) => request.id !== id));
    } catch (err) {
      setError("Failed to deny request. Please try again.");
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className={"error"}>{error}</div>;

  if (!requests || requests.length === 0) {
    return <div className="no-requests">No requests at the moment.</div>;
  }
  return (
    <div className="tableContainer">
      <table className="table">
        <thead>
          <tr>
            <th>Requester Name</th>
            <th>Request Date</th>
            <th>Specialty</th>
            <th>Price</th>
            <th>Experience</th>
            <th>Rating</th>
            <th>Location</th>
            <th>Waiting Time</th>
            {/* <th>Request Message</th> */}
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {requests.map((request) => (
            <tr key={request.id}>
              <td>{request.requester_name}</td>
              <td>{new Date(request.request_date).toLocaleDateString()}</td>
              <td>{request.doctor_data.specialty}</td>
              <td>${request.doctor_data.price.toFixed(2)}</td>
              <td>{request.doctor_data.experience} years</td>
              <td>{request.doctor_data.rating.toFixed(1)}</td>
              <td>{request.doctor_data.location}</td>
              <td>{request.doctor_data.waiting_time} minutes</td>
              {/* <td>{request.request_message}</td> */}
              <td>
                <button
                  className="approveButton"
                  onClick={() => handleApprove(request.id)}
                >
                  Approve
                </button>
                <button
                  className="denyButton"
                  onClick={() => handleDeny(request.id)}
                >
                  Deny
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminRoleRequestTable;
