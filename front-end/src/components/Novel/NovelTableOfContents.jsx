import { useNavigate } from "react-router-dom";
import { timeAgo } from "../../helpers/timeFormating";
import toSlug from "../../helpers/toSlug";

const NovelTableOfContents = ({ novelId, novelTitle, chapters = [] }) => {
  const navigate = useNavigate();

  console.log(chapters);

  return (
    <div className="novel-table-of-contents card">
      <div className="novel-table-of-contents-header">
        <h3>TABLE OF CONTENTS</h3>
        <div>{chapters && chapters.length} Chapters</div>
      </div>

      <div className="novel-table-of-contents-sorting-options">
        <button className="chapter-name-sort">Chapter Name</button>
        <button className="release-date-sort">Release Date</button>
      </div>

      <div className="chapters">
        {chapters.length > 0 ? (
          chapters.map((chapter) => {
            return (
              <div
                key={chapter.id}
                className="chapter"
                onClick={() =>
                  navigate(
                    `/novels/${novelId}/${toSlug(novelTitle)}/read/chapters/${chapter.id}/${toSlug(chapter.title)}`,
                  )
                }
              >
                <div className="chapter-name">{chapter.title}</div>
                <div className="chapter-release-date">
                  {timeAgo(chapter.createdAt)}
                </div>
              </div>
            );
          })
        ) : (
          <div> No posted chapters</div>
        )}
      </div>
    </div>
  );
};

export default NovelTableOfContents;
