import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

import App from "../App";

import NovelHeader from "../components/Novel/NovelHeader";
import NovelInfo from "../components/Novel/NovelInfo";
import NovelStatistics from "../components/Novel/NovelStatistics";
import NovelActionButtons from "../components/Novel/NovelActionButtons";
import NovelTableOfContents from "../components/Novel/NovelTableOfContents";

const Novel = () => {
  const { id } = useParams();

  const [isLoading, setIsLoading] = useState(true);
  const [novel, SetNovel] = useState({});
  const [error, SetError] = useState("");

  useEffect(() => {
    const novelData = () => {
      fetch(`/api/novels/${id}`)
        .then((response) => {
          if (response.status >= 400) {
            throw new Error("Server Error");
          }
          return response.json();
        })
        .then((response) => SetNovel(response))
        .catch((error) => SetError(error.message))
        .finally(() => setIsLoading(false));
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

          <NovelInfo />

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
