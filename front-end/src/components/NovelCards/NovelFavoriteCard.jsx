import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { unFavorite } from "../../api/novelInteractions";
import { useToast } from "../../context/useToast";
import styles from "./NovelCard.module.css";
import Button from "../FormFields/Button";
import NovelCardLayout from "./NovelCardLayout";

const NovelFavoriteCard = ({
  id,
  title,
  novelSlug,
  coverUrl,
  author,
  synopsis,
  stats,
  onRemove,
}) => {
  const [expanded, setExpanded] = useState(false);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const summaryRef = useRef(null);
  const { showToast } = useToast();

  useEffect(() => {
    const el = summaryRef.current;
    if (el) {
      requestAnimationFrame(() => {
        setIsOverflowing(el.scrollHeight > el.clientHeight);
      });
    }
  }, [synopsis]);

  const onUnfavorite = async () => {
    try {
      await unFavorite(id);
      onRemove(id);
      showToast(`Novel "${title}" removed from list successfully`, "success");
    } catch (err) {
      console.error(err);
      showToast(`Novel "${title}" removal from list was unsuccessful`, "error");
    }
  };

  return (
    <NovelCardLayout id={id} novelSlug={novelSlug} coverUrl={coverUrl}>
      <Link
        className={styles["novel-card-title"]}
        to={`/novels/${id}/${novelSlug}`}
      >
        {title}
      </Link>

      <div className={styles["novel-meta"]}>
        <div className={styles["pages-number"]}>
          {Math.ceil(stats.wordCount / 275)} PAGES
        </div>
        <div className={styles["novel-author"]}>
          by <span>{author.userName}</span>
        </div>
      </div>

      <div
        ref={summaryRef}
        className={`novel-summary ${expanded ? "expanded" : "collapsed"}`}
        dangerouslySetInnerHTML={{ __html: synopsis }}
      ></div>

      {isOverflowing && (
        <Button
          styleType="white-text-only"
          onClick={() => setExpanded(!expanded)}
        >
          {expanded ? "Show Less" : "Show More"}
        </Button>
      )}

      <Button onClick={() => onUnfavorite()} styleType="red-white">
        Unfavorite
      </Button>
    </NovelCardLayout>
  );
};
export default NovelFavoriteCard;
