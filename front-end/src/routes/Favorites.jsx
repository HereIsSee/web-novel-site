import { TbStarFilled } from "react-icons/tb";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import App from "../App";
import NovelFavoriteCard from "../components/NovelCards/NovelFavoriteCard";
import SectionWrapper from "../components/SectionWrapper";

const Favorites = () => {
  const { isLoggedIn } = useAuth();

  if (!isLoggedIn) return <Navigate to="/" replace />;

  return (
    <App>
      <SectionWrapper title="Favorites" Icon={TbStarFilled}>
        <NovelFavoriteCard />
        <NovelFavoriteCard />
        <NovelFavoriteCard />
      </SectionWrapper>
    </App>
  );
};

export default Favorites;
