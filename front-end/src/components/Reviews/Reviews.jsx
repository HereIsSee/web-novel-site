import { useState } from "react";
import { useToast } from "../../context/useToast";
import { deleteReview } from "../../api/reviews";
import SectionWrapper from "../SectionWrapper";
import styles from "./Reviews.module.css";
import ConfirmationModule from "../ConfirmationModule/ConfimationModule";
import Review from "./Review";

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

  return (
    <SectionWrapper title="Reviews">
      {reviews && reviews.length > 0 ? (
        reviews.map((review) => {
          return (
            <Review
              key={review.author.id}
              review={review}
              currentUserId={currentUserId}
              onDeleteClick={() => setShowConfirm(true)}
            />
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
