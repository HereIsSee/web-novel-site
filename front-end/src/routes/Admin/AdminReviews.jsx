import { useEffect, useState, useCallback } from "react";
import { getReviews, deleteReview } from "../../api/admin";
import { useToast } from "../../context/useToast";
import styles from "./Admin.module.css";
import InputField from "../../components/FormFields/InputField";
import Button from "../../components/FormFields/Button";
import Pagination from "../../components/Pagination/Pagination";
import AdminReviewCard from "../../components/Reviews/AdminReviewCard";

const PAGE_SIZE = 5;

const AdminReviews = () => {
  const [search, setSearch] = useState("");
  const [reviews, setReviews] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(1);

  const { showToast } = useToast();

  const fetchReviews = useCallback(async (pageNumber = 1, searchTerm = "") => {
    const response = await getReviews(searchTerm, pageNumber, PAGE_SIZE);
    console.log("REVIEWS: ", response.reviews);
    setReviews(response.reviews);
    setTotalCount(response.totalCount);
    setPage(pageNumber);
  }, []);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  const handleSearch = () => {
    fetchReviews(1, search);
  };

  const onDelete = async (userId, novelId) => {
    try {
      await deleteReview(userId, novelId);
      showToast("Review deleted successfully", "success");

      const updatedTotal = totalCount - 1;
      const totalPagesAfterDelete = Math.ceil(updatedTotal / PAGE_SIZE);

      const pageToFetch =
        page > totalPagesAfterDelete ? totalPagesAfterDelete : page;

      fetchReviews(pageToFetch, search);
      setTotalCount(updatedTotal);
    } catch (err) {
      console.error(err);
      showToast("Something went wrong", "error");
    }
  };

  const totalPages = Math.ceil(totalCount / PAGE_SIZE);

  return (
    <>
      <div className="basic-search">
        <InputField
          type="text"
          styleType="search"
          placeholder="Search for username/title/content..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Button onClick={handleSearch}>Search</Button>
      </div>

      <div className={styles.content}>
        {console.log(reviews)}
        {reviews && reviews.length > 0 ? (
          reviews.map((review) => {
            return (
              <div
                key={`${review.author.id}${review.novel.id}`}
                className={styles.comment}
              >
                <AdminReviewCard
                  review={review}
                  onDeleteClick={() =>
                    onDelete(review.author.id, review.novel.id)
                  }
                  isAdmin={true}
                />
              </div>
            );
          })
        ) : (
          <h3>No reviews found</h3>
        )}
      </div>

      <Pagination
        totalPages={totalPages}
        currentPage={page}
        onPageChange={(newPage) => fetchReviews(newPage, search)}
      />
    </>
  );
};

export default AdminReviews;
