import { Link } from "react-router-dom";
import styles from "./NovelCard.module.css";
import Button from "../FormFields/Button";
import DefaultImage from "/default-image.png";

const NovelMiniCardLayout = ({ id, title, novelSlug, coverUrl, children }) => {
  return (
    <div className={styles["mini-novel-card"]}>
      <Link to={`/novels/${id}/${novelSlug}`} className="link-with-image">
        <img src={coverUrl ?? DefaultImage} alt="novel cover" />
      </Link>
      <div>
        <Link
          className={styles["mini-novel-card-title"]}
          to={`/novels/${id}/${novelSlug}`}
        >
          {title}
        </Link>

        <div className={styles["content"]}>{children}</div>
      </div>
    </div>
  );
};
export default NovelMiniCardLayout;
