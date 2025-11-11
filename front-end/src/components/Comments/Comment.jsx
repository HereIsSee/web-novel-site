import React from "react";
import { timeAgo } from "../../helpers/timeFormating";
import styles from "./Comments.module.css";
import DefaultImage from "/avatar_default.webp";

const Comment = ({ comment, userId, onDelete, isAdmin = false }) => {
  return (
    <div className={styles.comment}>
      <div className={styles.commentAvatar}>
        <img
          src={comment.author.avatarUrl ?? DefaultImage}
          alt="Profile image"
        />
      </div>

      <div className={styles.commentBody}>
        <div className={styles.commentAuthor}>{comment.author.userName}</div>
        <div className={styles.commentTimestamp}>
          {timeAgo(comment.createdAt)}
        </div>
        <div
          className={styles.commentContent}
          dangerouslySetInnerHTML={{ __html: comment.content }}
        ></div>
        {(comment.author.id === Number(userId) || isAdmin) && (
          <button
            onClick={() => onDelete(comment.id)}
            className={styles.commentDeleteButton}
          >
            Delete
          </button>
        )}
      </div>
    </div>
  );
};

export default Comment;
