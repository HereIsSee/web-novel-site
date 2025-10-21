import NovelTags from "./NovelTags";
import NovelSummary from "./NovelSummary";

const NovelInfo = () => {
  return (
    <div className="novel-info card">
      <NovelTags />

      <NovelSummary />
    </div>
  );
};

export default NovelInfo;
