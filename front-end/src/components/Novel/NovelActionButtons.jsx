import {
  follow,
  favorite,
  readLater,
  unFollow,
  unFavorite,
  unReadLater,
} from "../../api/novelInteractions";

const NovelActionButtons = ({
  novelId,
  userNovelStatus,
  setUserNovelStatus,
}) => {
  const handleInteraction = async (key, apiPair) => {
    const prev = userNovelStatus[key];

    // optimistic update
    setUserNovelStatus((prevState) => ({
      ...prevState,
      [key]: !prev,
    }));

    const [doAction, undoAction] = apiPair;

    console.log(userNovelStatus);

    try {
      if (prev) await undoAction(novelId);
      else await doAction(novelId);
    } catch (err) {
      setUserNovelStatus((prevState) => ({
        ...prevState,
        [key]: prev,
      }));
      console.error(`Error updating ${key}:`, err.message);
    }
  };
  const onFollow = () => handleInteraction("isFollowed", [follow, unFollow]);
  const onFavorite = () =>
    handleInteraction("isFavorited", [favorite, unFavorite]);
  const onReadLater = () =>
    handleInteraction("isReadLater", [readLater, unReadLater]);

  return (
    <div className="novel-action-buttons card">
      <button>Rate it!</button>
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
    </div>
  );
};

export default NovelActionButtons;
