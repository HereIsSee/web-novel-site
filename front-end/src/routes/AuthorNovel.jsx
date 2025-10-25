import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getNovel } from "../api/novel";
import { getNovelStats } from "../api/novelInteractions";
import AuthorDashboardLayout from "../components/AuthorDashboardLayout";

import NovelHeader from "../components/Novel/NovelHeader";
import NovelInfo from "../components/Novel/NovelInfo";
import NovelStatistics from "../components/Novel/NovelStatistics";
import NovelTableOfContents from "../components/Novel/NovelTableOfContents";

const AuthorNovel = () => {
  const { userId, novelId } = useParams();

  const [novelStats, setNovelStats] = useState({});
  const [novel, setNovel] = useState({});

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [novelData, novelStatsData] = await Promise.all([
          getNovel(novelId),
          getNovelStats(novelId),
        ]);

        setNovel(novelData);
        setNovelStats(novelStatsData);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [novelId]);

  return (
    <AuthorDashboardLayout subTitle="Novel">
      {isLoading ? (
        <>
          <h1>Loading...</h1>
        </>
      ) : error ? (
        <>
          <h1>Error: {error}</h1>
        </>
      ) : (
        <div className="novel">
          <NovelHeader
            title={novel.title}
            author={novel.author.userName}
            coverImageUrl={novel.coverImageUrl}
            isAuthor={true}
            onClick={() =>
              navigate(`/author-dashboard/${userId}/novel/${novelId}/edit`)
            }
          />

          <NovelInfo tags={novel.tags} synopsis={novel.synopsis} />

          <NovelStatistics novelStats={novelStats} />

          <NovelTableOfContents />
        </div>
      )}
    </AuthorDashboardLayout>
  );
};

export default AuthorNovel;
