import { Link } from "react-router-dom";
import styles from "./NovelCard.module.css";
import { useState } from "react";

import NovelTags from "../Novel/NovelTags";
import NovelSummary from "../Novel/NovelSummary";

import NovelCardLayout from "./NovelCardLayout";

const NovelCard = ({
  id,
  title,
  synopsis,
  coverImageUrl,
  createdAt,
  tags,
  stats,
}) => {
  const [showMore, setShowMore] = useState(false);

  const novelSlog = "the-legend-of-william-oh";

  return (
    <NovelCardLayout id={id} coverUrl={coverImageUrl}>
      <Link
        className={styles["novel-card-title"]}
        to={`/novels/${id}/${novelSlog}`}
      >
        {title}
      </Link>

      <div className={`${styles["novel-meta"]} ${styles["with-button"]}`}>
        <NovelTags tags={tags} />
        <button
          className={styles["show-more"]}
          onClick={() => setShowMore(!showMore)}
        >
          {showMore ? "-" : "+"}
        </button>
      </div>

      <div className={styles["novel-card-statistics"]}>
        <div>
          <div className={styles["novel-card-statistic"]}>
            {stats.followsCount} FOLLOWERS
          </div>
          <div className={styles["novel-card-statistic"]}>2,223 PAGES</div>
          <div className={styles["novel-card-statistic"]}>
            {stats.chaptersCount} CHAPTERS
          </div>
        </div>

        <div>
          <div className={styles["novel-card-statistic"]}>
            {stats.overallScore} STARS
          </div>
          <div className={styles["novel-card-statistic"]}>
            {stats.views} VIEWS
          </div>
          <div className={styles["novel-card-statistic"]}>{createdAt}</div>
        </div>
      </div>

      {showMore && <NovelSummary synopsis={synopsis} />}
    </NovelCardLayout>
  );
};
export default NovelCard;
