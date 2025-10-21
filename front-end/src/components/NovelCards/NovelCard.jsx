import { Link } from "react-router-dom";
import styles from "./NovelCard.module.css";
import { useState } from "react";
import NovelCover from "/the-legend-of-william-oh.png";

import NovelTags from "../Novel/NovelTags";
import NovelSummary from "../Novel/NovelSummary";

import NovelCardLayout from "./NovelCardLayout";

const NovelCard = ({ id, title, synopsis, coverImageUrl, stats }) => {
  const [showMore, setShowMore] = useState(false);

  const novelSlog = "the-legend-of-william-oh";

  return (
    <NovelCardLayout id={id} coverUrl={NovelCover}>
      <Link
        className={styles["novel-card-title"]}
        to={`/novels/${id}/${novelSlog}`}
      >
        {title}
      </Link>

      <div className={`${styles["novel-meta"]} ${styles["with-button"]}`}>
        <NovelTags />
        <button
          className={styles["show-more"]}
          onClick={() => setShowMore(!showMore)}
        >
          {showMore ? "-" : "+"}
        </button>
      </div>

      <div className={styles["novel-card-statistics"]}>
        <div>
          <div className={styles["novel-card-statistic"]}>10,032 FOLLOWERS</div>
          <div className={styles["novel-card-statistic"]}>2,223 PAGES</div>
          <div className={styles["novel-card-statistic"]}>13 CHAPTERS</div>
        </div>

        <div>
          <div className={styles["novel-card-statistic"]}>4.82 STARS</div>
          <div className={styles["novel-card-statistic"]}>23,002 VIEWS</div>
          <div className={styles["novel-card-statistic"]}>
            7/6/2023, 8:23 PM
          </div>
        </div>
      </div>

      {showMore && <NovelSummary synopsis={synopsis} />}
    </NovelCardLayout>
  );
};
export default NovelCard;
