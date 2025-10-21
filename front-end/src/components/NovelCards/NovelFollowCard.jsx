import { Link } from "react-router-dom";
import styles from "./NovelCard.module.css";
import NovelCover from "/the-legend-of-william-oh.png";
import Button from "../FormFields/Button";
import NovelCardLayout from "./NovelCardLayout";

const NovelFollowCard = ({ id, title, allRead = false }) => {
  const novelSlog = "the-legend-of-william-oh";

  return (
    <NovelCardLayout id={id} coverUrl={NovelCover} fitMode="hide">
      <Link
        className={styles["novel-card-title"]}
        to={`/novels/${id}/${novelSlog}`}
      >
        The Legend Of William Oh
      </Link>

      {allRead ? (
        <>
          <div className={styles["novel-meta"]}>
            <div className={styles["novel-status"]}>
              Last Update & Last Read
            </div>
            <div className={styles["novel-author"]}>
              by <span>Macronomicon</span>
            </div>
          </div>
          <Link
            className={`${styles["last-update"]} ${styles["last-read"]}}`}
            to={`/novels/${2}/chapters/${2}`}
          >
            <div>Chapter Name</div>
            <div>19 hours ago</div>
          </Link>
        </>
      ) : (
        <>
          <div className={styles["novel-meta"]}>
            <div className={styles["novel-status"]}>Last Update</div>
            <div className={styles["novel-author"]}>
              by <span>Macronomicon</span>
            </div>
          </div>
          <Link
            className={styles["last-update"]}
            to={`/novels/${2}/chapters/${2}`}
          >
            <div>Chapter Name</div>
            <div>19 hours ago</div>
          </Link>

          <div className={styles["novel-status"]}>Last Read Chapter</div>
          <Link
            className={styles["last-read"]}
            to={`/novels/${2}/chapters/${2}`}
          >
            <div>Chapter Name</div>
            <div>19 hours ago</div>
          </Link>
        </>
      )}

      {!allRead && (
        <Button styleType="blue-white" align="right">
          Nex Chapter
        </Button>
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
