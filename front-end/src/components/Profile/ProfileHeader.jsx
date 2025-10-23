import ProfilePicture from "/avatar_default.webp";

const ProfileHeader = ({ onClick }) => {
  return (
    <div className="profile-header">
      <div className="upper-bar blurred-picture-cover">
        <img src={ProfilePicture} alt="" />

        <button className="edit" onClick={onClick}>
          Edit
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
  );
};

export default ProfileHeader;
