import { Link } from "react-router-dom";
import styles from "./NovelCard.module.css";
import DefaultCover from "/default-image.png";

const NovelCardLayout = ({
  coverUrl,
  link,
  fitMode = "center", // Options: center or hide
  children,
}) => {
  return (
    <div className={`${styles["novel-card"]} ${styles[fitMode]}`}>
      <Link to={link} className={styles["link-with-image"]}>
        <img src={coverUrl ?? DefaultCover} alt="novel cover" />
      </Link>
      <div className={styles["novel-card-info"]}>{children}</div>
    </div>
  );
};
export default NovelCardLayout;
