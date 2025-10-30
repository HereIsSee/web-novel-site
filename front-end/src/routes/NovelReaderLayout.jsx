import { useEffect, useState } from "react";
import { useParams, Outlet, useNavigate } from "react-router-dom";
import { getNovel } from "../api/novel";
import { getNovelChapters } from "../api/chapter";
import App from "../App";

const NovelReaderLayout = () => {
  const { novelId, novelSlug, chapterId } = useParams();
  const navigate = useNavigate();

  const [novel, setNovel] = useState(null);
  const [chapters, setChapters] = useState([]);
  const [currentChapter, setCurrentChapter] = useState(null);

  // Fetch novel and chapters once
  useEffect(() => {
    const fetchData = async () => {
      try {
        const novelData = await getNovel(novelId);
        const chaptersData = await getNovelChapters(novelId);

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

  // Navigation helpers
  const prevChapter =
    currentChapter &&
    chapters.find((c) => c.chapterNumber === currentChapter.chapterNumber - 1);
  const nextChapter =
    currentChapter &&
    chapters.find((c) => c.chapterNumber === currentChapter.chapterNumber + 1);

  const goToChapter = (chapter) => {
    setCurrentChapter(chapter);
    navigate(
      `/novels/${novelId}/${novelSlug}/read/chapters/${chapter.id}/${encodeURIComponent(chapter.title)}`,
    );
  };

  if (!novel || !currentChapter) return <div>Loading...</div>;

  const contextValue = {
    novel,
    chapters,
    currentChapter,
    prevChapter,
    nextChapter,
    goToChapter,
  };

  return (
    <App className="reader-layout">
      <header className="reader-header">
        <h2>{novel.title}</h2>
      </header>

      <Outlet context={contextValue} />
    </App>
  );
};

export default NovelReaderLayout;
