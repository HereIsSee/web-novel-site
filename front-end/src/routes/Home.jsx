import { useState, useEffect } from "react";
import { FaRegClock, FaTrophy } from "react-icons/fa";
import { AiFillPlaySquare } from "react-icons/ai";
import { getTopNovels, getLatestNovels } from "../api/novel";
import toSlug from "../helpers/toSlug";
import App from "../App";
import SectionWrapper from "../components/SectionWrapper";
import NovelLatestUpdateMiniCard from "../components/NovelCards/NovelLatestUpdateMiniCard";
import NovelMiniCard from "../components/NovelCards/NovelMiniCard";

const Home = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [topOngoingNovels, setTopOngoingNovels] = useState([]);
  const [topCompletedNovels, setTopCompletedNovels] = useState([]);
  const [latestNovels, setLatestNovels] = useState([]);

  const [error, SetError] = useState("");

  useEffect(() => {
    const fetchNovels = async () => {
      setIsLoading(true);
      try {
        const [topOngoing, topCompleted, latest] = await Promise.all([
          getTopNovels(5, "ongoing"),
          getTopNovels(5, "completed"),
          getLatestNovels(5),
        ]);

        setTopOngoingNovels(topOngoing);
        setTopCompletedNovels(topCompleted);
        setLatestNovels(latest);
        console.log("TOP ONGOING: ", topOngoing);
        console.log("TOP COMPLETED: ", topCompleted);
        console.log("LATEST: ", latest);
      } catch (err) {
        console.error(err);
        SetError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchNovels();
  }, []);

  if (isLoading) {
    return (
      <App>
        <h1>Loading...</h1>
      </App>
    );
  }
  if (error) {
    return (
      <App>
        <h1>Something went wrong: {error}</h1>
      </App>
    );
  }

  return (
    <App>
      <SectionWrapper title="Latest Updates" Icon={FaRegClock}>
        {latestNovels &&
          latestNovels.map((novel) => {
            return (
              <NovelLatestUpdateMiniCard
                key={novel.id}
                id={novel.id}
                title={novel.title}
                novelSlug={toSlug(novel.title)}
                coverUrl={novel.coverImageUrl}
                chapters={novel.chapters}
              />
            );
          })}
      </SectionWrapper>

      <div className="novel-categories">
        <SectionWrapper title="Best Completed" Icon={FaTrophy}>
          {topCompletedNovels &&
            topCompletedNovels.map((novel) => {
              return (
                <NovelMiniCard
                  key={novel.id}
                  id={novel.id}
                  title={novel.title}
                  novelSlug={toSlug(novel.title)}
                  coverUrl={novel.coverImageUrl}
                  tags={novel.tags}
                  stats={novel.stats}
                />
              );
            })}
        </SectionWrapper>

        <SectionWrapper title="Best Ongoing" Icon={AiFillPlaySquare}>
          {topOngoingNovels &&
            topOngoingNovels.map((novel) => {
              return (
                <NovelMiniCard
                  key={novel.id}
                  id={novel.id}
                  title={novel.title}
                  novelSlug={toSlug(novel.title)}
                  coverUrl={novel.coverImageUrl}
                  tags={novel.tags}
                  stats={novel.stats}
                />
              );
            })}
        </SectionWrapper>
      </div>
    </App>
  );
};

export default Home;
