import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getNovel, deleteNovel } from "../api/novel";
import { getNovelChapters, deleteChapter } from "../api/chapter";
import { formatDateTime, timeAgo } from "../helpers/timeFormating";
import styles from "./AuthorNovel.module.css";
import AuthorDashboardLayout from "../components/AuthorDashboardLayout";
import { useToast } from "../context/useToast";
import {
  IoDocumentText,
  IoDocuments,
  IoStatsChartSharp,
} from "react-icons/io5";

import { MdOutlineDeleteForever } from "react-icons/md";
import { FaEdit } from "react-icons/fa";
import { FaArrowUp, FaArrowDown, FaRegPlusSquare } from "react-icons/fa";
import { FiFilePlus } from "react-icons/fi";

import ConfirmationModule from "../components/ConfirmationModule/ConfimationModule";

import NovelHeader from "../components/Novel/NovelHeader";
import NovelInfo from "../components/Novel/NovelInfo";
import NovelStatistics from "../components/Novel/NovelStatistics";
import NovelTableOfContents from "../components/Novel/NovelTableOfContents";

const iconStyles = {
  display: "inline",
  verticalAlign: "middle",
  marginRight: "4px",
  color: "inherit",
};
const iconSize = "30px";

const AuthorNovel = () => {
  const { userId, novelId } = useParams();

  const [novel, setNovel] = useState({});
  const [chapters, setChapters] = useState([]);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const { showToast } = useToast();

  const [show, setShow] = useState("Novel Info");

  const [showConfirm, setShowConfirm] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [novelData, chaptersData] = await Promise.all([
          getNovel(novelId),
          getNovelChapters(novelId),
        ]);

        setNovel(novelData);
        console.log(chaptersData);
        setChapters(
          [...chaptersData].sort((a, b) => a.chapterNumber - b.chapterNumber),
        );
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [novelId]);

  const handleConfirmDelete = async () => {
    if (deleteTarget.type === "novel") {
      try {
        await deleteNovel(novelId);
        showToast("Novel deleted successfully", "success");
        navigate(`/author-dashboard/${userId}`);
      } catch (err) {
        console.error(err);
        showToast(err.message, "error");
      }
    }

    if (deleteTarget.type === "chapter") {
      try {
        await deleteChapter(novelId, deleteTarget.chapterId);
        showToast("Chapter deleted successfully", "success");
        setChapters((prev) =>
          prev.filter((chapter) => chapter.id !== deleteTarget.chapterId),
        );
      } catch (err) {
        console.error(err);
        showToast(err.message, "error");
      }
      console.log("Deleting chapter with id:", deleteTarget.chapterId);
    }

    setShowConfirm(false);
    setDeleteTarget(null);
  };

  return (
    <AuthorDashboardLayout subTitle="Novel">
      {isLoading ? (
        <>
          <h1>Loading...</h1>
        </>
      ) : error ? (
        <>
          <h1>Error: {error}</h1>
        </>
      ) : (
        <div className={styles["novel-container"]}>
          <div className={styles["column-one"]}>
            <img
              className={styles["cover"]}
              src={novel.coverImageUrl}
              alt="novel cover image"
            />
            <div className={styles["selection-box"]}>
              <button
                className={styles["selection"]}
                onClick={() => setShow("Novel Info")}
              >
                <IoDocumentText style={iconStyles} size={iconSize} />
                Novel Info
              </button>
              <button
                className={styles["selection"]}
                onClick={() => setShow("Novel Statistics")}
              >
                <IoStatsChartSharp style={iconStyles} size={iconSize} />
                Novel Statistics
              </button>
              <button
                className={styles["selection"]}
                onClick={() => setShow("Chapters")}
              >
                <IoDocuments style={iconStyles} size={iconSize} />
                Chapters
              </button>
            </div>
          </div>
          <div className={styles["column-two"]}>
            <div className={styles["title"]}>{novel.title}</div>
            {show === "Novel Info" ? (
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
                    onClick={() =>
                      navigate(
                        `/author-dashboard/${userId}/novel/${novelId}/edit`,
                      )
                    }
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
            ) : show === "Novel Statistics" ? (
              <div className={styles["container"]}>
                <div className={styles["header"]}>Novel Statistics</div>
                <div className={styles["info-item"]}>
                  <div>Overall Score</div>
                  <div>{novel.stats.overallScore}</div>
                </div>

                <div className={styles["info-item"]}>
                  <div>Style Score</div>
                  <div>{novel.stats.styleScore}</div>
                </div>

                <div className={styles["info-item"]}>
                  <div>Story Score</div>
                  <div>{novel.stats.storyScore}</div>
                </div>

                <div className={styles["info-item"]}>
                  <div>Grammar Score</div>
                  <div>{novel.stats.grammarScore}</div>
                </div>

                <div className={styles["info-item"]}>
                  <div>Character Score</div>
                  <div>{novel.stats.characterScore}</div>
                </div>

                <hr />

                <div className={styles["info-item"]}>
                  <div>Ratings</div>
                  <div>{novel.stats.ratings}</div>
                </div>

                <div className={styles["info-item"]}>
                  <div>Views</div>
                  <div>{novel.stats.characterScore}</div>
                </div>

                <hr />

                <div className={styles["info-item"]}>
                  <div>Follows</div>
                  <div>{novel.stats.followsCount}</div>
                </div>

                <div className={styles["info-item"]}>
                  <div>Favorites</div>
                  <div>{novel.stats.favoritesCount}</div>
                </div>

                <div className={styles["info-item"]}>
                  <div>Read Laters</div>
                  <div>{novel.stats.readLatersCount}</div>
                </div>

                <hr />

                <div className={styles["info-item"]}>
                  <div>Chapters Count</div>
                  <div>{novel.stats.chaptersCount}</div>
                </div>

                <div className={styles["info-item"]}>
                  <div>Pages</div>
                  <div>{Math.ceil(novel.stats.wordCount / 275)}</div>
                </div>

                <div className={styles["info-item"]}>
                  <div>Word Count</div>
                  <div>{novel.stats.wordCount}</div>
                </div>
              </div>
            ) : (
              <div className={styles["container"]}>
                <div className={styles.headerContainer}>
                  <div className={styles.header}>Chapters</div>
                  <div className={styles.headerRight}>
                    <div className={styles.chapterNumber}>
                      {chapters.length}
                    </div>
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
                  </div>
                </div>
                <hr />
                {chapters && chapters.length > 0 ? (
                  chapters.map((chapter, index) => {
                    return (
                      <div className={styles.chapterContainer} key={chapter.id}>
                        <div className={styles.chapterIndex}>#{index + 1}</div>
                        <div className={styles.chapterTitle}>
                          {chapter.title}
                        </div>
                        <div className={styles.chapterDate}>
                          {timeAgo(chapter.createdAt)}
                        </div>
                        <div className={styles.chapterButtons}>
                          <button
                            className={`${styles["update-button"]} ${styles.button}`}
                            onClick={() =>
                              navigate(
                                `/author-dashboard/${userId}/novel/${novelId}/chapters/${chapter.id}/edit`,
                              )
                            }
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
            )}
          </div>
        </div>
      )}
      <ConfirmationModule
        open={showConfirm}
        message={
          deleteTarget?.type === "novel"
            ? "Are you sure you want to delete this novel? This action cannot be undone."
            : "Are you sure you want to delete this chapter?"
        }
        onConfirm={handleConfirmDelete}
        onClose={() => setShowConfirm(false)}
      />
    </AuthorDashboardLayout>
  );
};

export default AuthorNovel;
