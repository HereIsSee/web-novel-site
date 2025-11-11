import { formatDateTime } from "../../helpers/timeFormating";
import { useOutletContext } from "react-router-dom";
import styles from "./AuthorNovel.module.css";

const NovelManagerInfo = () => {
  const {
    role,
    novel,
    userId,
    novelId,
    navigate,
    setDeleteTarget,
    setShowConfirm,
  } = useOutletContext();

  return (
    <>
      <div
        className={styles["summary"]}
        dangerouslySetInnerHTML={{ __html: novel.synopsis }}
      ></div>
      <div className={styles["container"]}>
        <div className={styles["header"]}>Info</div>
        <div className={styles["info-item"]}>
          <div>Created At</div>
          <div>{formatDateTime(novel.createdAt)}</div>
        </div>

        <div className={styles["info-item"]}>
          <div>Updated At</div>
          <div>{formatDateTime(novel.updatedAt)}</div>
        </div>

        <div className={styles["info-item"]}>
          <div>Status</div>
          <div>{novel.status}</div>
        </div>
      </div>
      <div className={styles["buttons-container"]}>
        <button
          className={`${styles["update-button"]} ${styles["button"]}`}
          onClick={() => {
            if (role === "admin")
              navigate(`/admin-dashboard/novel/${novelId}/edit`);
            else navigate(`/author-dashboard/${userId}/novel/${novelId}/edit`);
          }}
        >
          Update
        </button>
        <button
          className={`${styles["delete-button"]} ${styles["button"]}`}
          onClick={() => {
            setDeleteTarget({ type: "novel" });
            setShowConfirm(true);
          }}
        >
          Delete
        </button>
      </div>
    </>
  );
};

export default NovelManagerInfo;
