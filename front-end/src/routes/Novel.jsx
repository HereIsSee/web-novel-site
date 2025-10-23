import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getNovel } from "../api/novel";

import App from "../App";

import NovelHeader from "../components/Novel/NovelHeader";
import NovelInfo from "../components/Novel/NovelInfo";
import NovelStatistics from "../components/Novel/NovelStatistics";
import NovelActionButtons from "../components/Novel/NovelActionButtons";
import NovelTableOfContents from "../components/Novel/NovelTableOfContents";

const Novel = () => {
  const { id } = useParams();

  const [isLoading, setIsLoading] = useState(true);
  const [novel, setNovel] = useState({});
  const [error, setError] = useState("");

  useEffect(() => {
    const novelData = async () => {
      try {
        console.log("NovelId: ", id);
        const response = await getNovel(id);
        console.log(response);
        setNovel(response);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    novelData();
  }, [id]);

  console.log(novel);

  return (
    <App>
      {isLoading ? (
        <>
          <h1>Loading...</h1>
        </>
      ) : error ? (
        <>
          <h1>{console.log(error)}</h1>
        </>
      ) : (
        <div className="novel container">
          <NovelHeader title={novel.title} author={novel.author.userName} />

          <NovelInfo tags={novel.tags} synopsis={novel.synopsis} />

          <NovelStatistics />

          <NovelActionButtons />

          <NovelTableOfContents />

          <div>Comments</div>
        </div>
      )}
    </App>
  );
};

export default Novel;
