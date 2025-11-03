import { Link } from "react-router-dom";
import toSlug from "../../helpers/toSlug";
import styles from "./NovelCard.module.css";
import NovelMiniCardLayout from "./NovelMiniCardLayout";

const NovelLatestUpdateMiniCard = ({
  id,
  title,
  novelSlug,
  coverUrl,
  chapters,
}) => {
  return (
    <NovelMiniCardLayout
      id={id}
      title={title}
      novelSlug={novelSlug}
      coverUrl={coverUrl}
    >
      {chapters.map((chapter) => {
        return (
          <Link
            key={chapter.id}
            className={styles["chapter"]}
            to={`/novels/${id}/${novelSlug}/read/chapters/${chapter.id}/${toSlug(chapter.title)}`}
          >
            {chapter.title}
          </Link>
        );
      })}
    </NovelMiniCardLayout>
  );
};
export default NovelLatestUpdateMiniCard;
