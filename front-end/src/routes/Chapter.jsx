import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { TbStarFilled } from "react-icons/tb";
import { getChapter } from "../api/chapter";
import { getNovel } from "../api/novel";
import App from "../App";
import Button from "../components/FormFields/Button";
import NovelMiniCard from "../components/NovelCards/NovelMiniCard";

const Chapter = () => {
  const { novelId, chapterId } = useParams();

  const [novel, setNovel] = useState({});
  const [chapter, setChapter] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [chapterData, novelData] = await Promise.all([
          getChapter(novelId, chapterId),
          getNovel(novelId),
        ]);

        console.log(novelData, chapterData);
        setNovel(novelData);
        setChapter(chapterData);
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
  }, [novelId, chapterId]);

  return (
    <App>
      <div className="chapter-header">
        <div className="title-author">
          <div>
            {novel.title} <span>by</span>
            <span className="author"> {novel.author.userName} </span>
            <span className="stars">
              {novel.stats.overallScore}
              <TbStarFilled
                style={{
                  display: "inline",
                  verticalAlign: "middle",
                  marginLeft: "4px",
                  marginTop: "-10px",
                }}
                size="50px"
              />
            </span>
          </div>
        </div>

        <div className="chapter-title">{chapter.title}</div>
        <Button styleType="blue-white" align="stretch" onClick={() => navigate}>
          Fiction Page
        </Button>
        <Button styleType="red-white" align="stretch">
          Report Chapter
        </Button>
      </div>

      <div className="chapter-container card">
        <div className="chapter-buttons">
          <Button styleType="blue-white">Previous Chapter</Button>

          <Button styleType="blue-white">Next Chapter</Button>
        </div>

        <div
          className="chapter-content"
          dangerouslySetInnerHTML={{ __html: chapter.content }}
        ></div>

        <div className="chapter-buttons">
          <Button styleType="blue-white">Previous Chapter</Button>

          <Button styleType="blue-white">Fiction Index</Button>

          <Button styleType="blue-white">Next Chapter</Button>
        </div>
      </div>
    </App>
  );
};

export default Chapter;
