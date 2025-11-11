import { useEffect, useState, useCallback } from "react";
import { getComments, deleteComment } from "../../api/admin";
import { useToast } from "../../context/useToast";
import styles from "./Admin.module.css";
import InputField from "../../components/FormFields/InputField";
import Button from "../../components/FormFields/Button";
import Pagination from "../../components/Pagination/Pagination";
import Comment from "../../components/Comments/Comment";

const PAGE_SIZE = 5;

const AdminComments = () => {
  const [search, setSearch] = useState("");
  const [comments, setComments] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(1);

  const { showToast } = useToast();

  const fetchComments = useCallback(async (pageNumber = 1, searchTerm = "") => {
    const response = await getComments(
      searchTerm,
      pageNumber,
      PAGE_SIZE,
      false,
    );
    console.log(response);
    setComments(response.comments);
    setTotalCount(response.totalCount);
    setPage(pageNumber);
  }, []);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  const handleSearch = () => {
    fetchComments(1, search);
  };

  const onDelete = async (commentId) => {
    try {
      await deleteComment(commentId);
      showToast("Comment deleted successfully", "success");

      const updatedTotal = totalCount - 1;
      const totalPagesAfterDelete = Math.ceil(updatedTotal / PAGE_SIZE);

      const pageToFetch =
        page > totalPagesAfterDelete ? totalPagesAfterDelete : page;

      fetchComments(pageToFetch, search);
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
          placeholder="Search for username/content..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Button onClick={handleSearch}>Search</Button>
      </div>

      <div className={styles.content}>
        {console.log(comments)}
        {comments.length > 0 ? (
          comments.map((comment) => {
            return (
              <div className={styles.comment}>
                <Comment
                  key={comment.id}
                  comment={comment}
                  onDelete={onDelete}
                  isAdmin={true}
                />
              </div>
            );
          })
        ) : (
          <h3>No comments found</h3>
        )}
      </div>

      <Pagination
        totalPages={totalPages}
        currentPage={page}
        onPageChange={(newPage) => fetchComments(newPage, search)}
      />
    </>
  );
};

export default AdminComments;
