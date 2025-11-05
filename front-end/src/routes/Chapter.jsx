import { useOutletContext } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "../context/useAuth";
import {
  getFollow,
  updateFollowLastReadChapter,
} from "../api/novelInteractions";
import { getChapterComments } from "../api/comment";
import { FaClockRotateLeft } from "react-icons/fa6";
import {
  MdOutlineKeyboardDoubleArrowLeft,
  MdOutlineKeyboardDoubleArrowRight,
} from "react-icons/md";
import Comments from "../components/Comments/Comments";
import Button from "../components/FormFields/Button";

const iconStyles = {
  display: "inline",
  verticalAlign: "middle",
  marginRight: "4px",
  marginTop: "-3px",
  color: "#ffffffff",
};
const iconSize = "22px";

const Chapter = () => {
  const {
    novelId,
    currentChapter,
    prevChapter,
    nextChapter,
    goToChapter,
    goToFiction,
  } = useOutletContext();
  const { user, isLoggedIn, isLoading } = useAuth();
  const [followInfo, setFollowInfo] = useState({ isFollowing: false });
  const [comments, setComments] = useState([]);
  const [refetchComments, setRefetchComments] = useState(false);

  useEffect(() => {
    if (isLoading || !isLoggedIn) return;
    const fetchData = async () => {
      try {
        const [followData, comments] = await Promise.all([
          getFollow(user.id, novelId),
          getChapterComments(currentChapter.id),
        ]);
        setFollowInfo(followData);
        setComments(comments);
        console.log(comments);
        console.log(followData);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, [isLoading, isLoggedIn, user, novelId, currentChapter]);

  useEffect(() => {
    if (!isLoggedIn || !followInfo?.isFollowing || !currentChapter) return;

    if (
      currentChapter.chapterNumber > followInfo.lastReadChapterNumber &&
      currentChapter.chapterNumber - followInfo.lastReadChapterNumber < 2
    ) {
      const updateProgress = async () => {
        try {
          await updateFollowLastReadChapter(novelId, currentChapter.id);
          setFollowInfo((prev) => ({
            ...prev,
            lastReadChapterNumber: currentChapter.chapterNumber,
            lastReadChapterId: currentChapter.id,
          }));
          console.log("Auto-updated reading progress");
        } catch (err) {
          console.error("Failed to auto-update last read chapter:", err);
        }
      };

      updateProgress();
    }
  }, [isLoggedIn, followInfo, novelId, currentChapter]);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const commentsData = await getChapterComments(currentChapter.id);
        setComments(commentsData);
      } catch (err) {
        console.error(err);
      }
    };
    fetchComments();
  }, [currentChapter, refetchComments]);

  const updateLastRead = async () => {
    try {
      await updateFollowLastReadChapter(novelId, currentChapter.id);
      setFollowInfo((prev) => ({
        ...prev,
        lastReadChapterId: currentChapter.id,
        lastReadChapterNumber: currentChapter.chapterNumber,
      }));
    } catch (err) {
      console.error("Failed to update last read chapter:", err);
    }
  };

  const diff =
    followInfo.isFollowing && followInfo.lastReadChapterNumber != null
      ? currentChapter.chapterNumber - followInfo.lastReadChapterNumber
      : 0;
  const skipped = diff > 1 && followInfo.isFollowing;
  const backtracked = diff < 0 && followInfo.isFollowing;

  return (
    <>
      {!currentChapter ? (
        <div>Loading chapter...</div>
      ) : (
        <>
          {(skipped || backtracked) && (
            <div className="card message">
              {skipped
                ? "You seem to have skipped some chapters! "
                : "It appears that you've backtracked! "}
              Do you want to move your Reading Progress to this chapter?
              <Button
                align="right"
                style={{ padding: "10px", fontSize: "18px" }}
                onClick={() => updateLastRead()}
              >
                <FaClockRotateLeft style={iconStyles} size={iconSize} />
                Set progress
              </Button>
            </div>
          )}

          <div className="chapter-container card">
            <div className="chapter-buttons">
              <Button
                styleType="blue-white"
                onClick={() => prevChapter && goToChapter(prevChapter)}
                disabled={!prevChapter}
              >
                <MdOutlineKeyboardDoubleArrowLeft
                  style={iconStyles}
                  size={iconSize}
                />
                Previous Chapter
              </Button>
              <Button
                styleType="blue-white"
                onClick={() => nextChapter && goToChapter(nextChapter)}
                disabled={!nextChapter}
              >
                Next Chapter
                <MdOutlineKeyboardDoubleArrowRight
                  style={iconStyles}
                  size={iconSize}
                />
              </Button>
            </div>

            <div
              className="chapter-content"
              dangerouslySetInnerHTML={{ __html: currentChapter.content }}
            />

            <div className="chapter-buttons">
              <Button
                styleType="blue-white"
                onClick={() => prevChapter && goToChapter(prevChapter)}
                disabled={!prevChapter}
              >
                Previous Chapter
              </Button>
              <Button styleType="blue-white" onClick={goToFiction}>
                Fiction Index
              </Button>
              <Button
                styleType="blue-white"
                onClick={() => nextChapter && goToChapter(nextChapter)}
                disabled={!nextChapter}
              >
                Next Chapter
              </Button>
            </div>
          </div>
          <Comments
            userId={user?.id}
            chapterId={currentChapter.id}
            comments={comments}
            onChange={() => setRefetchComments(!refetchComments)}
          />
        </>
      )}
    </>
  );
};

export default Chapter;
