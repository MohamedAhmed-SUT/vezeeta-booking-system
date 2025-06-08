import React, { useState, useEffect } from "react";

const Profile: React.FC = () => {
  const [user, setUser] = useState<{
    first_name: string;
    last_name: string;
    role: string;
    email?: string;
    phone_number?: string;
    image_url?: string;
  } | null>(null);

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchUserProfile = async () => {
      const token = localStorage.getItem("token");

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
          setUser({
            first_name: data.first_name,
            last_name: data.last_name,
            role: data.role,
            email: data.email,
            phone_number: data.phone_number,
            image_url: data.image_url,
          });
        } else {
          setError("Failed to fetch user data. Please try again.");
        }
      } catch (error) {
        setError("An error occurred while fetching the profile data.");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  if (loading) {
    return <div className="text-center py-5">Loading...</div>;
  }

  if (error) {
    return <div className="alert alert-danger text-center py-5">{error}</div>;
  }

  if (user) {
    return (
      <div className="container py-5">
        <h1 className="text-primary text-center">Profile</h1>
        <div className="card mt-4 shadow">
          <div className="card-body text-center">
            {user.image_url && (
              <img
                src={user.image_url}
                alt="Profile"
                className="img-fluid rounded-circle mb-3"
                style={{ width: "150px", height: "150px", objectFit: "cover" }}
              />
            )}
            <h5 className="card-title">
              {user.first_name} {user.last_name}
            </h5>
            <p className="card-text">
              <strong>Role:</strong> {user.role}
            </p>
            {user.email && (
              <p className="card-text">
                <strong>Email:</strong> {user.email}
              </p>
            )}
            {user.phone_number && (
              <p className="card-text">
                <strong>Phone:</strong> {user.phone_number}
              </p>
            )}
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default Profile;
