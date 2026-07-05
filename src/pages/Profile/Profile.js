import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "./Profile.css";

function Profile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/");
  }

  return (
    <div className="container section profile-page">
      <div className="section-head">
        <div>
          <span className="eyebrow">Account</span>
          <h1>Profile</h1>
        </div>
        <button className="btn btn-ghost" onClick={handleLogout}>
          Logout
        </button>
      </div>

      <div className="profile-card">
        <div className="profile-row">
          <span>Name</span>
          <strong>
            {user.firstName} {user.lastName}
          </strong>
        </div>
        <div className="profile-row">
          <span>Email</span>
          <strong>{user.email}</strong>
        </div>
      </div>

      {/* <p className="form-note">
        This is a fake, local-only session for learning purposes — replace
        authService.js with Shopify Customer Authentication to make this real.
      </p> */}
    </div>
  );
}

export default Profile;
