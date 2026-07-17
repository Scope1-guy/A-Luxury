import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "./Profile.css";

function Profile() {
  const { user, logout, updateName } = useAuth();
  const navigate = useNavigate();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const hasName = user.firstName || user.lastName;

  function handleLogout() {
    logout();
    navigate("/");
  }

  async function handleSaveName(e) {
    e.preventDefault();
    setError("");
    setSaving(true);
    try {
      await updateName(firstName.trim(), lastName.trim());
    } catch (err) {
      setError(err.message || "Could not save your name. Please try again.");
    } finally {
      setSaving(false);
    }
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
            {hasName
              ? `${user.firstName || ""} ${user.lastName || ""}`.trim()
              : "Not provided yet"}
          </strong>
        </div>
        <div className="profile-row">
          <span>Email</span>
          <strong>{user.email}</strong>
        </div>
      </div>

      {!hasName && (
        <form className="profile-name-form" onSubmit={handleSaveName}>
          <p className="form-note">Add your name to your account:</p>
          <div className="form-row">
            <input
              type="text"
              placeholder="First name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
            />

            <input
              type="text"
              placeholder="Last name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
            />
          </div>
          {error && <p className="form-error">{error}</p>}
          <button className="btn btn-primary" type="submit" disabled={saving}>
            {saving ? "Saving…" : "Save name"}
          </button>
        </form>
      )}
    </div>
  );
}

export default Profile;