import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

const Header: React.FC = () => {
  const [user, setUser] = useState<{ role: string; first_name: string } | null>(
    null
  );
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const response = await fetch("http://127.0.0.1:8000/user/", {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          });

          if (response.ok) {
            const data = await response.json();
            setUser({ role: data.role, first_name: data.first_name });
          } else {
            setUser(null);
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
          setUser(null);
        }
      }
    };

    fetchUser();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    navigate("/login"); // Redirect to login page after logout
  };

  return (
    <header className="header bg-primary py-3 shadow">
      <div className="container d-flex justify-content-between align-items-center">
        <div className="logo">
          <Link to="/">
            <h1 className="text-white">
              Vezeeta<span className="text-warning">.com</span>
            </h1>
          </Link>
        </div>
        <nav className="nav-links d-flex align-items-center">
          <Link to="/" className="text-white mx-3">
            Home
          </Link>
          <Link to="/doctors" className="text-white mx-3">
            Doctors
          </Link>
          {user?.role === "admin" && (
            <Link to="/requests" className="text-white mx-3">
              Requests
            </Link>
          )}
          {user?.role === "doctor" && (
            <Link to="/Appointments" className="text-white mx-3">
              Appointments
            </Link>
          )}
          {localStorage.getItem("token") && user?.role !== "doctor" && user?.role !== "admin" && (
            <Link
              to="/DoctorRegister"
              className="text-white mx-3"
              style={{ whiteSpace: "nowrap" }}
            >
              Are you a Doctor?
            </Link>
          )}
          {!user && (
            <>
              <Link to="/register" className="text-white mx-3">
                Register
              </Link>
              <Link to="/login" className="text-white mx-3">
                Login
              </Link>
            </>
          )}
          {user?.role == "patient" && (
            <Link to="/appointments/patient" className="text-white mx-3" style={{ whiteSpace: "nowrap" }}>         
              My Appointments
            </Link>
          )}
          {user && (
            <>
              <Link to="/Profile" className="text-white mx-3">
                <span className="text-white mx-3">{user.first_name}</span>
              </Link>
              <button className="btn btn-danger" onClick={handleLogout}>
                Logout
              </button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
