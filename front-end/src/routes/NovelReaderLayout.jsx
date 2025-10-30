import { useEffect, useState } from "react";
import { useParams, Outlet, useNavigate } from "react-router-dom";
import { getNovel } from "../api/novel";
import { getNovelChapters } from "../api/chapter";
import { TbStarFilled } from "react-icons/tb";
import toSlug from "../helpers/toSlug";
import App from "../App";
import Button from "../components/FormFields/Button";

const NovelReaderLayout = () => {
  const { novelId, novelSlug, chapterId } = useParams();
  const navigate = useNavigate();

  const [novel, setNovel] = useState(null);
  const [chapters, setChapters] = useState([]);
  const [currentChapter, setCurrentChapter] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [novelData, chaptersData] = await Promise.all([
          getNovel(novelId),
          getNovelChapters(novelId),
        ]);
        setNovel(novelData);
        setChapters(chaptersData);

        const initialChapter =
          chaptersData.find((c) => c.id === parseInt(chapterId)) ||
          chaptersData[0];
        setCurrentChapter(initialChapter);
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, [novelId, chapterId]);

  const prevChapter =
    currentChapter &&
    chapters.find((c) => c.chapterNumber === currentChapter.chapterNumber - 1);
  const nextChapter =
    currentChapter &&
    chapters.find((c) => c.chapterNumber === currentChapter.chapterNumber + 1);

  const goToChapter = (chapter) => {
    setCurrentChapter(chapter);
    navigate(
      `/novels/${novelId}/${novelSlug}/read/chapters/${chapter.id}/${toSlug(chapter.title)}`,
    );
  };
  const goToFiction = () => {
    navigate(`/novels/${novelId}/${novelSlug}`);
  };

  if (!novel || !currentChapter) return <div>Loading...</div>;

  const contextValue = {
    novel,
    chapters,
    currentChapter,
    prevChapter,
    nextChapter,
    goToChapter,
    goToFiction,
  };

  return (
    <App className="reader-layout">
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

        <div className="chapter-title">{currentChapter.title}</div>
        <Button styleType="blue-white" align="stretch" onClick={goToFiction}>
          Fiction Page
        </Button>
        <Button styleType="red-white" align="stretch">
          Report Chapter
        </Button>
      </div>

      <Outlet context={contextValue} />
    </App>
  );
};

export default NovelReaderLayout;
