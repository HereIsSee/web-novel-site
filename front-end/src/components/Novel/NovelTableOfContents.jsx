const NovelTableOfContents = () => {
  return (
    <div className="novel-table-of-contents card">
      <div className="novel-table-of-contents-header">
        <h3>TABLE OF CONTENTS</h3>
        <div>231 Chapters</div>
      </div>

      <div className="novel-table-of-contents-sorting-options">
        <button className="chapter-name-sort">Chapter Name</button>
        <button className="release-date-sort">Release Date</button>
      </div>

      <div className="chapters">
        <div className="chapter">
          <div className="chapter-name">Chapter 1</div>
          <div className="chapter-release-date"> 1 year ago</div>
        </div>

        <div className="chapter">
          <div className="chapter-name">Chapter 2</div>
          <div className="chapter-release-date"> 1 year ago</div>
        </div>

        <div className="chapter">
          <div className="chapter-name">Chapter 3</div>
          <div className="chapter-release-date"> 1 year ago</div>
        </div>

        <div className="chapter">
          <div className="chapter-name">Chapter 4</div>
          <div className="chapter-release-date"> 1 year ago</div>
        </div>

        <div className="chapter">
          <div className="chapter-name">Chapter 5</div>
          <div className="chapter-release-date"> 1 year ago</div>
        </div>

        <div className="chapter">
          <div className="chapter-name">Chapter 6</div>
          <div className="chapter-release-date"> 1 year ago</div>
        </div>

        <div className="chapter">
          <div className="chapter-name">Chapter 7</div>
          <div className="chapter-release-date"> 1 year ago</div>
        </div>
      </div>
    </div>
  );
};

export default NovelTableOfContents;
