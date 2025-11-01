import { Link, useNavigate } from "react-router-dom";
import { timeAgo } from "../../helpers/timeFormating";
import toSlug from "../../helpers/toSlug";
import styles from "./NovelCard.module.css";
import Button from "../FormFields/Button";
import NovelCardLayout from "./NovelCardLayout";

const NovelFollowCard = ({
  id,
  title,
  coverUrl,
  author,
  latestChapter,
  lastReadChapter,
  nextChapter,
}) => {
  const navigate = useNavigate();

  const allRead =
    lastReadChapter !== null && latestChapter.id === lastReadChapter.id;
  const hasReadNovel = lastReadChapter !== null;
  const novelSlug = toSlug(title);

  return (
    <NovelCardLayout
      id={id}
      coverUrl={coverUrl}
      novelSlug={novelSlug}
      fitMode="hide"
    >
      <Link
        className={styles["novel-card-title"]}
        to={`/novels/${id}/${novelSlug}`}
      >
        {title}
      </Link>

      <div className={styles["novel-meta"]}>
        <div className={styles["novel-status"]}>
          Last Update {allRead && "& Last Read"}
        </div>
        <div className={styles["novel-author"]}>
          by <span>{author.userName}</span>
        </div>
      </div>
      <Link
        className={styles["last-update"]}
        to={`/novels/${id}/${novelSlug}/read/chapters/${latestChapter.id}/${toSlug(latestChapter.title)}`}
      >
        <div>{latestChapter.title}</div>
        <div>{timeAgo(latestChapter.createdAt)}</div>
      </Link>

      {hasReadNovel && !allRead && (
        <>
          <div className={styles["novel-status"]}>Last Read Chapter</div>
          <Link
            className={styles["last-read"]}
            to={`/novels/${id}/${novelSlug}/read/chapters/${lastReadChapter.id}/${toSlug(lastReadChapter.title)}`}
          >
            <div>{lastReadChapter.title}</div>
            <div>{timeAgo(lastReadChapter.createdAt)}</div>
          </Link>
        </>
      )}

      {!allRead && (
        <div className={styles["button-wrapper"]}>
          <Button
            styleType="blue-white"
            onClick={() =>
              navigate(
                `/novels/${id}/${novelSlug}/read/chapters/${nextChapter.id}/${toSlug(nextChapter.title)}`,
              )
            }
          >
            {hasReadNovel ? "Nex Chapter" : "Start reading"}
          </Button>
        </div>
      )}
    </NovelCardLayout>
  );
};
export default NovelFollowCard;

<div className={styles["novel-meta"]}>
  <div className={styles["pages-number"]}>1851 PAGES</div>
  <div className={styles["novel-author"]}>
    by <span>Macronomicon</span>
  </div>
</div>;
