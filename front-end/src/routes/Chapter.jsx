import { useOutletContext } from "react-router-dom";
import Button from "../components/FormFields/Button";

const Chapter = () => {
  const { currentChapter, prevChapter, nextChapter, goToChapter, goToFiction } =
    useOutletContext();

  if (!currentChapter) return <div>Loading chapter...</div>;

  return (
    <div className="chapter-container card">
      <div className="chapter-buttons">
        <Button
          styleType="blue-white"
          onClick={() => prevChapter && goToChapter(prevChapter)}
          disabled={!prevChapter}
        >
          Previous Chapter
        </Button>
        <Button
          styleType="blue-white"
          onClick={() => nextChapter && goToChapter(nextChapter)}
          disabled={!nextChapter}
        >
          Next Chapter
        </Button>
      </div>

      <div
        className="chapter-content"
        dangerouslySetInnerHTML={{ __html: currentChapter.content }}
      />

      <div className="chapter-buttons">
        <Button
          styleType="blue-white"
          onClick={() => prevChapter && goToChapter(prevChapter)}
          disabled={!prevChapter}
        >
          Previous Chapter
        </Button>
        <Button styleType="blue-white" onClick={goToFiction}>
          Fiction Index
        </Button>
        <Button
          styleType="blue-white"
          onClick={() => nextChapter && goToChapter(nextChapter)}
          disabled={!nextChapter}
        >
          Next Chapter
        </Button>
      </div>
    </div>
  );
};

export default Chapter;
