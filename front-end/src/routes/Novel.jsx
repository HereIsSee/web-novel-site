import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getNovel } from "../api/novel";
import { useAuth } from "../context/useAuth";
import {
  getUserNovelStatus,
  getNovelStats,
  incrementView,
} from "../api/novelInteractions";

import App from "../App";

import NovelHeader from "../components/Novel/NovelHeader";
import NovelInfo from "../components/Novel/NovelInfo";
import NovelStatistics from "../components/Novel/NovelStatistics";
import NovelActionButtons from "../components/Novel/NovelActionButtons";
import NovelTableOfContents from "../components/Novel/NovelTableOfContents";

const Novel = () => {
  const { id: novelId } = useParams();

  const { isLoading: authIsLoading, isLoggedIn } = useAuth();

  const [novel, setNovel] = useState({});
  const [userNovelStatus, setUserNovelStatus] = useState({});
  const [novelStats, setNovelStats] = useState({});

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (authIsLoading) return;

    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [novelData, novelStatsData, userStatusData, updatedViews] =
          await Promise.all([
            getNovel(novelId),
            getNovelStats(novelId),
            isLoggedIn ? getUserNovelStatus(novelId) : Promise.resolve(null),
            incrementView(novelId),
          ]);

        setNovel(novelData);
        setNovelStats({ ...novelStatsData, views: updatedViews.views });
        if (userStatusData) setUserNovelStatus(userStatusData);

        console.log(novelData);
        console.log(novelStatsData);
        console.log(userStatusData);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [novelId, authIsLoading, isLoggedIn]);

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
          <NovelHeader
            title={novel.title}
            author={novel.author.userName}
            coverImageUrl={novel.coverImageUrl}
          />

          <NovelInfo tags={novel.tags} synopsis={novel.synopsis} />

          <NovelStatistics novelStats={novelStats} />

          {isLoggedIn && (
            <NovelActionButtons
              novelId={novelId}
              userNovelStatus={userNovelStatus}
              setUserNovelStatus={setUserNovelStatus}
              setNovelStats={setNovelStats}
            />
          )}

          <NovelTableOfContents />

          <div>Comments</div>
        </div>
      )}
    </App>
  );
};

export default Novel;
