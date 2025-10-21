import { Link } from "react-router-dom";
import styles from "./NovelCard.module.css";

const NovelCardLayout = ({
  id,
  coverUrl,
  fitMode = "center", // Options: center or hide
  children,
}) => {
  const novelSlog = "the-legend-of-william-oh";

  return (
    <div className={`${styles["novel-card"]} ${styles[fitMode]}`}>
      <Link
        to={`/novels/${id}/${novelSlog}`}
        className={styles["link-with-image"]}
      >
        <img src={coverUrl} alt="novel cover" />
      </Link>
      <div className={styles["novel-card-info"]}>{children}</div>
    </div>
  );
};
export default NovelCardLayout;
