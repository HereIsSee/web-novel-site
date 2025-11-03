import { Link } from "react-router-dom";
import styles from "./NovelCard.module.css";
import NovelMiniCardLayout from "./NovelMiniCardLayout";
import NovelTags from "../Novel/NovelTags";
import { MdGroups } from "react-icons/md";

const NovelMiniCard = ({ id, title, novelSlug, coverUrl, tags, stats }) => {
  return (
    <NovelMiniCardLayout
      id={id}
      title={title}
      novelSlug={novelSlug}
      coverUrl={coverUrl}
    >
      <div className={styles["latest-update-chapters"]}>
        <NovelTags tags={tags} />
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
          {stats.followsCount} FOLLOWERS
        </div>
      </div>
    </NovelMiniCardLayout>
  );
};
export default NovelMiniCard;
