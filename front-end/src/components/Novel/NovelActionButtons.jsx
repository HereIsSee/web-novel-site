import {
  follow,
  favorite,
  readLater,
  unFollow,
  unFavorite,
  unReadLater,
} from "../../api/novelInteractions";
import { useState } from "react";
import ReviewModal from "../ReviewModule/ReviewModal";

const NovelActionButtons = ({
  novelId,
  userNovelStatus,
  setUserNovelStatus,
  setNovelStats,
}) => {
  const [showModal, setShowModal] = useState(false);

  const handleInteraction = async (key, apiPair, countKey) => {
    const prev = userNovelStatus[key];

    setUserNovelStatus((prevState) => ({
      ...prevState,
      [key]: !prev,
    }));

    if (countKey && setNovelStats) {
      setNovelStats((prevStats) => ({
        ...prevStats,
        [countKey]: prev ? prevStats[countKey] - 1 : prevStats[countKey] + 1,
      }));
    }

    const [doAction, undoAction] = apiPair;

    try {
      if (prev) await undoAction(novelId);
      else await doAction(novelId);
    } catch (err) {
      setUserNovelStatus((prevState) => ({
        ...prevState,
        [key]: prev,
      }));

      if (countKey && setNovelStats) {
        setNovelStats((prevStats) => ({
          ...prevStats,
          [countKey]: prev ? prevStats[countKey] + 1 : prevStats[countKey] - 1,
        }));
      }

      console.error(`Error updating ${key}:`, err.message);
    }
  };

  const onFollow = () =>
    handleInteraction("isFollowed", [follow, unFollow], "followsCount");
  const onFavorite = () =>
    handleInteraction("isFavorited", [favorite, unFavorite], "favoritesCount");
  const onReadLater = () =>
    handleInteraction(
      "isReadLater",
      [readLater, unReadLater],
      "readLatersCount",
    );

  return (
    <div className="novel-action-buttons card">
      <button onClick={() => setShowModal(true)}>Rate it!</button>
      <button
        onClick={onFollow}
        className={userNovelStatus.isFollowed ? "active" : ""}
      >
        Follow
      </button>
      <button
        onClick={onFavorite}
        className={userNovelStatus.isFavorited ? "active" : ""}
      >
        Favorite
      </button>
      <button
        onClick={onReadLater}
        className={userNovelStatus.isReadLater ? "active" : ""}
      >
        Read Later
      </button>

      {showModal && (
        <ReviewModal novelId={novelId} onClose={() => setShowModal(false)} />
      )}
    </div>
  );
};

export default NovelActionButtons;
