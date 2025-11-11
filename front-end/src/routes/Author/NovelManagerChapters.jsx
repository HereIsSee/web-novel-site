import { FiFilePlus } from "react-icons/fi";
import { FaEdit } from "react-icons/fa";
import { MdOutlineDeleteForever } from "react-icons/md";
import { timeAgo } from "../../helpers/timeFormating";
import { useOutletContext } from "react-router-dom";
import styles from "./AuthorNovel.module.css";

const NovelManagerChapters = () => {
  const {
    role,
    chapters,
    userId,
    novelId,
    navigate,
    setDeleteTarget,
    setShowConfirm,
    iconStyles,
    iconSize,
  } = useOutletContext();

  return (
    <div className={styles["container"]}>
      <div className={styles.headerContainer}>
        <div className={styles.header}>Chapters</div>
        <div className={styles.headerRight}>
          <div className={styles.chapterNumber}>{chapters.length}</div>
          {role === "author" && (
            <button
              className={styles.createButton}
              onClick={() =>
                navigate(
                  `/author-dashboard/${userId}/novel/${novelId}/chapters/create-chapter`,
                )
              }
            >
              <FiFilePlus style={iconStyles} size={iconSize} />
            </button>
          )}
        </div>
      </div>
      <hr />
      {chapters && chapters.length > 0 ? (
        chapters.map((chapter, index) => {
          return (
            <div className={styles.chapterContainer} key={chapter.id}>
              <div className={styles.chapterIndex}>#{index + 1}</div>
              <div className={styles.chapterTitle}>{chapter.title}</div>
              <div className={styles.chapterDate}>
                {timeAgo(chapter.createdAt)}
              </div>
              <div className={styles.chapterButtons}>
                <button
                  className={`${styles["update-button"]} ${styles.button}`}
                  onClick={() => {
                    if (role === "admin")
                      navigate(
                        `/admin-dashboard/novel/${novelId}/chapters/${chapter.id}/edit`,
                      );
                    else
                      navigate(
                        `/author-dashboard/${userId}/novel/${novelId}/chapters/${chapter.id}/edit`,
                      );
                  }}
                >
                  <FaEdit size={iconSize} />
                </button>
                <button
                  className={`${styles["delete-button"]} ${styles.button}`}
                  onClick={() => {
                    setDeleteTarget({
                      type: "chapter",
                      chapterId: chapter.id,
                    });
                    setShowConfirm(true);
                  }}
                >
                  <MdOutlineDeleteForever size={iconSize} />
                </button>
              </div>
            </div>
          );
        })
      ) : (
        <div>No chapters published</div>
      )}
    </div>
  );
};

export default NovelManagerChapters;
