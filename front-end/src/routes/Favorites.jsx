import { TbStarFilled } from "react-icons/tb";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import { useState, useEffect } from "react";
import { getUserFavoritedNovels } from "../api/novel";
import App from "../App";
import NovelFavoriteCard from "../components/NovelCards/NovelFavoriteCard";
import SectionWrapper from "../components/SectionWrapper";
import toSlug from "../helpers/toSlug";

const Favorites = () => {
  const { user, isLoggedIn, isLoading } = useAuth();
  const [favoriteNovels, setFavoriteNovels] = useState([]);

  useEffect(() => {
    if (isLoading || !isLoggedIn) return;
    const fetchData = async () => {
      try {
        const novelsData = await getUserFavoritedNovels(user.id);

        setFavoriteNovels(novelsData);
        console.log(novelsData);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, [isLoading, isLoggedIn, user]);

  const handleRemove = (id) => {
    setFavoriteNovels((prev) => prev.filter((novel) => novel.id !== id));
  };

  if (isLoading) return <div> Loading... </div>;

  if (!isLoggedIn) return <Navigate to="/" replace />;

  return (
    <App>
      <SectionWrapper title="Favorites" Icon={TbStarFilled}>
        {favoriteNovels.map((novel) => {
          return (
            <NovelFavoriteCard
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

export default Favorites;
