import { useNavigate } from "react-router-dom";
import toSlug from "../../helpers/toSlug";
import Button from "../FormFields/Button";

const NovelTableOfContents = ({
  novelId,
  novelTitle,
  chapters = [],
  isAuthor = false,
  onClick,
}) => {
  const navigate = useNavigate();

  console.log(chapters);

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
                <div className="chapter-release-date"> 1 year ago</div>
              </div>
            );
          })
        ) : (
          <div> No posted chapters</div>
        )}
      </div>

      {isAuthor && <Button onClick={onClick}>Create Chapter</Button>}
    </div>
  );
};

export default NovelTableOfContents;
