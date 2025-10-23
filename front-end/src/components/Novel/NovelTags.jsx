const NovelTags = ({ tags }) => {
  return (
    <div className="novel-tags">
      {tags.map((tag) => {
        return (
          <div key={tag.id} className="novel-tag">
            {tag.name}
          </div>
        );
      })}
    </div>
  );
};

export default NovelTags;
