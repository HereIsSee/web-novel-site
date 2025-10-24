import DefaultCover from "/default-image.png";
import Button from "../FormFields/Button";

const NovelHeader = ({
  title,
  author,
  coverImageUrl,
  isAuthor = false,
  onClick,
}) => {
  return (
    <div className={`novel-header ${isAuthor && "author-novel-header"}`}>
      <img src={coverImageUrl ?? DefaultCover} alt="novel cover art" />
      <div>
        <div className="novel-title">{title}</div>
        <div className="novel-author">by {author}</div>
      </div>

      {isAuthor && (
        <Button
          styleType="blue-white"
          align="left"
          style={{ marginTop: "10px" }}
          onClick={onClick}
        >
          Edit
        </Button>
      )}
    </div>
  );
};

export default NovelHeader;
