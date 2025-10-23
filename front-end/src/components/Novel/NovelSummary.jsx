const NovelSummary = ({ synopsis }) => {
  return (
    <div className="novel-summary">
      <div dangerouslySetInnerHTML={{ __html: synopsis }} />
    </div>
  );
};

export default NovelSummary;
