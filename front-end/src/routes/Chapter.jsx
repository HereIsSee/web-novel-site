import { useOutletContext } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "../context/useAuth";
import {
  getFollow,
  updateFollowLastReadChapter,
} from "../api/novelInteractions";
import { FaClockRotateLeft } from "react-icons/fa6";
import {
  MdOutlineKeyboardDoubleArrowLeft,
  MdOutlineKeyboardDoubleArrowRight,
} from "react-icons/md";
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

  useEffect(() => {
    if (isLoading || !isLoggedIn) return;
    const fetchData = async () => {
      try {
        const followData = await getFollow(user.id, novelId);
        setFollowInfo(followData);
        console.log(followData);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, [isLoading, isLoggedIn, user, novelId]);
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

  const diff = currentChapter.chapterNumber - followInfo.lastReadChapterNumber;
  const skipped = diff > 1;
  const backtracked = diff < 0;

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
        </>
      )}
    </>
  );
};

export default Chapter;
