import { formatDateTime } from "../../helpers/timeFormating";
import { FaTrash } from "react-icons/fa6";
import { useState } from "react";
import { useToast } from "../../context/useToast";
import { deleteReview } from "../../api/reviews";
import SectionWrapper from "../SectionWrapper";
import DefaultImage from "/avatar_default.webp";
import styles from "./Reviews.module.css";
import Button from "../FormFields/Button";
import ConfirmationModule from "../ConfirmationModule/ConfimationModule";

const Reviews = ({ novelId, currentUserId, reviews, onReviewDelete }) => {
  const [showConfirm, setShowConfirm] = useState(false);
  const { showToast } = useToast();

  const handleConfirmDelete = async () => {
    try {
      await deleteReview(novelId);
      onReviewDelete(currentUserId);
      showToast("Review deleted successfully", "success");
    } catch (err) {
      console.error(err);
      showToast(err.message, "error");
    }
    setShowConfirm(false);
  };

  console.log("GOTTEN REVIEWS: ", reviews);
  return (
    <SectionWrapper title="Reviews">
      {reviews && reviews.length > 0 ? (
        reviews.map((review) => {
          return (
            <div key={review.author.id} className={styles.review}>
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
                ></div>
                {currentUserId == review.author.id && (
                  <Button
                    align="right"
                    styleType="red-white"
                    onClick={() => setShowConfirm(true)}
                  >
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
                )}
              </div>
            </div>
          );
        })
      ) : (
        <div className={styles.noReviewsMessage}>
          No reviews present. Be the first to review the novel!
        </div>
      )}
      <ConfirmationModule
        open={showConfirm}
        message="Are you sure you want to delete this review?"
        onConfirm={handleConfirmDelete}
        onClose={() => setShowConfirm(false)}
      />
    </SectionWrapper>
  );
};

export default Reviews;
