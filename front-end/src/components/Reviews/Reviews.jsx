import { formatDateTime } from "../../helpers/timeFormating";
import SectionWrapper from "../SectionWrapper";
import DefaultImage from "/avatar_default.webp";
import styles from "./Reviews.module.css";

const Reviews = ({ reviews }) => {
  console.log("GOTTEN REVIEWS: ", reviews);
  return (
    <SectionWrapper title="Reviews">
      {reviews && reviews.length > 0 ? (
        reviews.map((review) => {
          return (
            <div className={styles.review}>
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
              </div>
            </div>
          );
        })
      ) : (
        <div className={styles.noReviewsMessage}>
          No reviews present. Be the first to review the novel!
        </div>
      )}
    </SectionWrapper>
  );
};

export default Reviews;
