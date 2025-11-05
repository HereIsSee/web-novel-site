import DefaultCover from "/default-image.png";
import Button from "../FormFields/Button";

const NovelHeader = ({ title, author, coverImageUrl }) => {
  return (
    <div className="novel-header">
      <img src={coverImageUrl ?? DefaultCover} alt="novel cover art" />
      <div>
        <div className="novel-title">{title}</div>
        <div className="novel-author">by {author}</div>
      </div>
    </div>
  );
};

export default NovelHeader;
