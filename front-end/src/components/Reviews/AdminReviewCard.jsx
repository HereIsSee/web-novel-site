import { FaTrash } from "react-icons/fa6";
import Button from "../FormFields/Button";
import DefaultImage from "/avatar_default.webp";
import { formatDateTime } from "../../helpers/timeFormating";
import styles from "./Reviews.module.css";

const AdminReviewCard = ({ review, onDeleteClick }) => {
  return (
    <div className={`${styles.review} ${styles.admin}`} key={review.author.id}>
      <div className={styles.columnOne}>
        <img
          src={review.author.avatarUrl ?? DefaultImage}
          alt="Reviewee profile image"
        />

        <div className={styles.scoreItem}>
          <div>Overall</div>
          <div>{review.overallScore}</div>
        </div>

        <div className={styles.scoreRow}>
          <div className={styles.scoreItem}>
            <div>Grammar</div>
            <div>{review.grammarScore}</div>
          </div>

          <div className={styles.scoreItem}>
            <div>Style</div>
            <div>{review.styleScore}</div>
          </div>
        </div>

        <div className={styles.scoreRow}>
          <div className={styles.scoreItem}>
            <div>Story</div>
            <div>{review.storyScore}</div>
          </div>

          <div className={styles.scoreItem}>
            <div>Character</div>
            <div>{review.characterScore}</div>
          </div>
        </div>
      </div>

      <div className={styles.columnTwo}>
        <div className={styles.title}>{review.title}</div>

        <div className={styles.title}>
          <span>FROM</span> {review.novel.title}
        </div>

        <div className={styles.reviewHeader}>
          <div className={styles.reviewAuthor}>
            <span>BY</span> {review.author.userName}
          </div>
          <div className={styles.reviewDate}>
            {formatDateTime(review.createdAt)}
          </div>
        </div>

        <div
          className={styles.reviewContent}
          dangerouslySetInnerHTML={{ __html: review.reviewContent }}
        />

        <Button align="right" styleType="red-white" onClick={onDeleteClick}>
          <FaTrash
            size="22px"
            style={{
              display: "inline",
              verticalAlign: "middle",
              marginRight: "4px",
              marginTop: "-4px",
              color: "inherit",
            }}
          />
          Delete
        </Button>
      </div>
    </div>
  );
};

export default AdminReviewCard;
