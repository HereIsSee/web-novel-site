import { useNavigate, useParams, useLocation, Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import { deleteNovelAdmin, deleteChapterAdmin } from "../../api/admin";
import { getNovel, deleteNovel } from "../../api/novel";
import { getNovelChapters, deleteChapter } from "../../api/chapter";
import styles from "./AuthorNovel.module.css";
import DashboardLayout from "../../components/DashboardLayout";
import { useToast } from "../../context/useToast";
import {
  IoDocumentText,
  IoDocuments,
  IoStatsChartSharp,
} from "react-icons/io5";
import ConfirmationModule from "../../components/ConfirmationModule/ConfimationModule";

const iconStyles = {
  display: "inline",
  verticalAlign: "middle",
  marginRight: "4px",
  color: "inherit",
};
const iconSize = "30px";

// role: admin or author
const NovelManager = ({ role }) => {
  const { userId, novelId } = useParams();
  const location = useLocation();
  const pathSegments = location.pathname.split("/");
  const currentTab = pathSegments[pathSegments.length - 1];

  const [novel, setNovel] = useState({});
  const [chapters, setChapters] = useState([]);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const { showToast } = useToast();

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
        if (role == "admin") await deleteNovelAdmin(novelId);
        else await deleteNovel(novelId);

        showToast("Novel deleted successfully", "success");
        navigate(`/author-dashboard/${userId}`);
      } catch (err) {
        console.error(err);
        showToast(err.message, "error");
      }
    }

    if (deleteTarget.type === "chapter") {
      try {
        if (role == "admin") await deleteChapterAdmin(deleteTarget.chapterId);
        else await deleteChapter(novelId, deleteTarget.chapterId);

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
    <DashboardLayout
      title={role == "admin" ? "Admin Dashboard" : "Author Dashboard"}
      subTitle="Novel"
    >
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
                className={`${styles["selection"]} ${currentTab === "novel-info" ? styles.selected : ""}`}
                onClick={() => {
                  if (role === "admin")
                    navigate(`/admin-dashboard/novels/${novelId}/novel-info`);
                  else
                    navigate(
                      `/author-dashboard/${userId}/novel/${novelId}/novel-info`,
                    );
                }}
              >
                <IoDocumentText style={iconStyles} size={iconSize} />
                Novel Info
              </button>
              <button
                className={`${styles["selection"]} ${currentTab === "stats" ? styles.selected : ""}`}
                onClick={() => {
                  if (role === "admin")
                    navigate(`/admin-dashboard/novels/${novelId}/stats`);
                  else
                    navigate(
                      `/author-dashboard/${userId}/novel/${novelId}/stats`,
                    );
                }}
              >
                <IoStatsChartSharp style={iconStyles} size={iconSize} />
                Novel Statistics
              </button>
              <button
                className={`${styles["selection"]} ${currentTab === "chapters" ? styles.selected : ""}`}
                onClick={() => {
                  if (role === "admin")
                    navigate(`/admin-dashboard/novels/${novelId}/chapters`);
                  else
                    navigate(
                      `/author-dashboard/${userId}/novel/${novelId}/chapters`,
                    );
                }}
              >
                <IoDocuments style={iconStyles} size={iconSize} />
                Chapters
              </button>
            </div>
          </div>
          <div className={styles["column-two"]}>
            <div className={styles["title"]}>{novel.title}</div>
            <Outlet
              context={{
                role,
                novel,
                chapters,
                userId,
                novelId,
                navigate,
                setDeleteTarget,
                setShowConfirm,
                iconStyles,
                iconSize,
              }}
            />
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
    </DashboardLayout>
  );
};

export default NovelManager;
