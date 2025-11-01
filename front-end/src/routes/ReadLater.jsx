import { IoBookSharp } from "react-icons/io5";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import { useState, useEffect } from "react";
import { getUserReadLaterNovels } from "../api/novel";
import App from "../App";
import NovelReadLaterCard from "../components/NovelCards/NovelReadLaterCard";
import SectionWrapper from "../components/SectionWrapper";
import toSlug from "../helpers/toSlug";

const ReadLater = () => {
  const { user, isLoggedIn, isLoading } = useAuth();
  const [readLaterNovels, setReadLaterNovels] = useState([]);

  useEffect(() => {
    if (isLoading || !isLoggedIn) return;
    const fetchData = async () => {
      try {
        const novelsData = await getUserReadLaterNovels(user.id);

        setReadLaterNovels(novelsData);
        console.log(novelsData);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, [isLoading, isLoggedIn, user]);

  const handleRemove = (id) => {
    setReadLaterNovels((prev) => prev.filter((novel) => novel.id !== id));
  };

  if (isLoading) return <div> Loading... </div>;

  if (!isLoggedIn) return <Navigate to="/" replace />;

  return (
    <App>
      <SectionWrapper title="Read Later" Icon={IoBookSharp}>
        {readLaterNovels.map((novel) => {
          return (
            <NovelReadLaterCard
              key={novel.id}
              id={novel.id}
              title={novel.title}
              novelSlug={toSlug(novel.title)}
              coverUrl={novel.coverImageUrl}
              author={novel.author}
              synopsis={novel.synopsis}
              stats={novel.stats}
              onRemove={handleRemove}
            />
          );
        })}
      </SectionWrapper>
    </App>
  );
};

export default ReadLater;
