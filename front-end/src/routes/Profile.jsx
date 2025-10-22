// import { useState } from 'react';
import { Link } from "react-dom";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import App from "../App";
import ProfileHeader from "../components/Profile/ProfileHeader";
import InputField from "../components/FormFields/InputField";
import Button from "../components/FormFields/Button";

const Profile = () => {
  const { isLoggedIn } = useAuth();

  if (!isLoggedIn) return <Navigate to="/" replace />;

  return (
    <App>
      <div className="container cover-background">
        <div className="profile-container">
          <ProfileHeader />
          <div className="profile-information card">
            <h3>Personal Information</h3>

            <div className="item">
              <div>Joined At</div>
              <div> 5/23/2023, 7:32 PM</div>
            </div>

            <div className="item">
              <div>User Name</div>
              <div>UserName</div>
            </div>

            <div className="item">
              <div>Email</div>
              <div>test@gmail.com</div>
            </div>

            <div className="item">
              <div>Bio</div>
              <div>asdfasdfdf</div>
            </div>
          </div>
        </div>
      </div>
    </App>
  );
};

export default Profile;
