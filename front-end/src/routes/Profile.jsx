// import { useState } from 'react';
import { Link } from "react-dom";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import { useState, useEffect } from "react";
import { getCurrentUser, updateUserData } from "../api/users";
import { useToast } from "../context/useToast";
import App from "../App";
import ProfileHeader from "../components/Profile/ProfileHeader";
import InputField from "../components/FormFields/InputField";
import Button from "../components/FormFields/Button";
import ProfilePicture from "/avatar_default.webp";

const Profile = () => {
  const { isLoggedIn, isLoading } = useAuth();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [refresh, setRefresh] = useState(false);

  const { showToast } = useToast();

  // Input fields
  const [inputUserName, setInputUserName] = useState("");
  const [inputEmail, setInputEmail] = useState("");
  const [inputBio, setInputBio] = useState("");

  useEffect(() => {
    if (!isLoggedIn) return;

    const fetchUser = async () => {
      try {
        const response = await getCurrentUser();
        setUser(response);

        // Set initial input fields values
        setInputUserName(response.userName);
        setInputEmail(response.email);
        setInputBio(response.bio ?? "");

        console.log(response);
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [isLoggedIn, refresh]);

  const updateProfile = async () => {
    try {
      const userUpdatedData = {
        UserName: inputUserName,
        Email: inputEmail,
        Bio: inputBio,
      };
      const response = await updateUserData(user.id, userUpdatedData);
      console.log(response);
      showToast("Profile updated successfully", "success");
      setIsEditing(false);
      setRefresh((prev) => !prev);
    } catch (err) {
      showToast(err.message, "error");
      console.log(err);
    }
  };

  if (isLoading || loading) return <div> Loading... </div>;

  if (!isLoggedIn) return <Navigate to="/" replace />;

  if (error) return <div>{error}</div>;

  return (
    <App>
      <div className="container cover-background">
        <div className="profile-container">
          <div className="profile-header">
            <div className="upper-bar blurred-picture-cover">
              <img src={ProfilePicture} alt="" />

              <button
                className="edit"
                onClick={() =>
                  isEditing ? updateProfile() : setIsEditing(true)
                }
              >
                {isEditing ? "Save" : "Edit"}
              </button>
            </div>

            <div className="lower-bar">
              <div>
                <div className="value">21</div>
                <div>Follows</div>
              </div>
              <div>
                <div className="value">23</div>
                <div>Favorites</div>
              </div>

              <h3>User Name</h3>

              <div>
                <div className="value">34</div>
                <div>Comments</div>
              </div>

              <div>
                <div className="value">2</div>
                <div>Fictions</div>
              </div>
            </div>
          </div>

          <div className="profile-information card">
            <h3>Personal Information</h3>

            <div className="item">
              <div>Joined At</div>
              <div>{user.joinedAt}</div>
              {/* 5/23/2023, 7:32 PM */}
            </div>

            <div className="item">
              <div>User Name</div>
              {isEditing ? (
                <InputField
                  type="text"
                  value={inputUserName}
                  onChange={(e) => setInputUserName(e.target.value)}
                />
              ) : (
                <div>{user.userName}</div>
              )}
            </div>

            <div className="item">
              <div>Email</div>

              {isEditing ? (
                <InputField
                  type="text"
                  value={inputEmail}
                  onChange={(e) => setInputEmail(e.target.value)}
                />
              ) : (
                <div>{user.email}</div>
              )}
            </div>

            <div className="item">
              <div>Bio</div>

              {isEditing ? (
                <InputField
                  type="text"
                  value={inputBio}
                  onChange={(e) => setInputBio(e.target.value)}
                />
              ) : (
                <div>{user.bio}</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </App>
  );
};

export default Profile;
