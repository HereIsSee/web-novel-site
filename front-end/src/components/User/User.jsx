import styles from "./User.module.css";
import DefaultImage from "/avatar_default.webp";
import { formatDateTime } from "../../helpers/timeFormating";

const User = ({ user, onDelete }) => {
  return (
    <div key={user.id} className={styles.user}>
      <div className={styles.userAvatar}>
        <img src={user.avatarUrl ?? DefaultImage} alt="Profile image" />
      </div>

      <div className={styles.content}>
        <div className={styles.item}>
          <div>Username</div>
          <div>{user.userName}</div>
        </div>
        <div className={styles.item}>
          <div>Email</div>
          <div>{user.email}</div>
        </div>

        <div className={styles.item}>
          <div>Joined At</div>
          <div>{formatDateTime(user.joinedAt)}</div>
        </div>

        <div className={styles.item}>
          <div>Role</div>
          <div>{user.role}</div>
        </div>

        <div className={styles.item}>
          <div>Bio</div>
          <div>{user.bio ?? "-----"}</div>
        </div>

        <button className={styles.delete} onClick={onDelete}>
          Delete
        </button>
      </div>
    </div>
  );
};

export default User;
