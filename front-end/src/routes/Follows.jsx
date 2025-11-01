import { FaBookmark } from "react-icons/fa";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import { useEffect, useState } from "react";
import { getUserFollowedNovels } from "../api/novel";
import App from "../App";
import NovelFollowCard from "../components/NovelCards/NovelFollowCard";
import SectionWrapper from "../components/SectionWrapper";

const Follows = () => {
  const { user, isLoggedIn, isLoading } = useAuth();

  const [followedNovels, setFollowedNovels] = useState([]);

  useEffect(() => {
    if (isLoading || !isLoggedIn) return;
    const fetchData = async () => {
      try {
        const followedNovelsData = await getUserFollowedNovels(user.id);
        setFollowedNovels(followedNovelsData);
        console.log(followedNovelsData);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, [user]);

  if (isLoading) return <div> Loading... </div>;

  if (!isLoggedIn) return <Navigate to="/" replace />;

  return (
    <App>
      <SectionWrapper title="Follow List" Icon={FaBookmark}>
        {followedNovels.map((novel) => {
          return (
            <NovelFollowCard
              key={novel.id}
              id={novel.id}
              title={novel.title}
              coverUrl={novel.coverImageUrl}
              author={novel.author}
              latestChapter={"nothing"}
              lastReadChapter={"nothing"}
            />
          );
        })}
        {/* <NovelFollowCard />
        <NovelFollowCard />
        <NovelFollowCard /> */}
      </SectionWrapper>
    </App>
  );
};

export default Follows;
