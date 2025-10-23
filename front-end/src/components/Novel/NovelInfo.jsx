import NovelTags from "./NovelTags";
import NovelSummary from "./NovelSummary";

const NovelInfo = ({ tags, synopsis }) => {
  return (
    <div className="novel-info card">
      <NovelTags tags={tags} />

      <NovelSummary synopsis={synopsis} />
    </div>
  );
};

export default NovelInfo;
