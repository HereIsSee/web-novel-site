import { FaBookmark } from "react-icons/fa";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import App from "../App";
import NovelFollowCard from "../components/NovelCards/NovelFollowCard";
import SectionWrapper from "../components/SectionWrapper";

const Follows = () => {
  const { isLoggedIn } = useAuth();

  if (!isLoggedIn) return <Navigate to="/" replace />;

  return (
    <App>
      <SectionWrapper title="Follow List" Icon={FaBookmark}>
        <NovelFollowCard />
        <NovelFollowCard />
        <NovelFollowCard />
        <NovelFollowCard />
      </SectionWrapper>
    </App>
  );
};

export default Follows;
