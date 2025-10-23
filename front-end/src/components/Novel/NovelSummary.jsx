const NovelSummary = ({ synopsis }) => {
  return (
    <div
      className="novel-summary"
      dangerouslySetInnerHTML={{ __html: synopsis }}
    />
  );
};

export default NovelSummary;
