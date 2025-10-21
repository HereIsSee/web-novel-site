import { Link } from "react-router-dom";
import styles from "./NovelCard.module.css";
import NovelMiniCardLayout from "./NovelMiniCardLayout";
import NovelTags from "../Novel/NovelTags";
import { MdGroups } from "react-icons/md";

const NovelMiniCard = ({ id, title, coverUrl }) => {
  return (
    <NovelMiniCardLayout id={id} title={title} coverUrl={coverUrl}>
      <div className={styles["latest-update-chapters"]}>
        <NovelTags />
        <div className={styles["follows"]}>
          <MdGroups
            style={{
              display: "inline",
              verticalAlign: "middle",
              marginRight: "4px",
              marginTop: "-3px",
            }}
            size="30px"
          />
          19,740 FOLLOWERS
        </div>
      </div>
    </NovelMiniCardLayout>
  );
};
export default NovelMiniCard;
