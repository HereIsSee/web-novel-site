import { useOutletContext } from "react-router-dom";
import styles from "./AuthorNovel.module.css";

const NovelManagertatistics = () => {
  const { novel } = useOutletContext();

  return (
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
  );
};

export default NovelManagertatistics;
