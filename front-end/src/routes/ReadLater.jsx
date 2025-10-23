import { IoBookSharp } from "react-icons/io5";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import App from "../App";
import NovelReadLaterCard from "../components/NovelCards/NovelReadLaterCard";
import SectionWrapper from "../components/SectionWrapper";

const ReadLater = () => {
  const { isLoggedIn, isLoading } = useAuth();

  if (isLoading) return <div> Loading... </div>;

  if (!isLoggedIn) return <Navigate to="/" replace />;

  return (
    <App>
      <SectionWrapper title="Read Later" Icon={IoBookSharp}>
        <NovelReadLaterCard />
        <NovelReadLaterCard />
        <NovelReadLaterCard />
      </SectionWrapper>
    </App>
  );
};

export default ReadLater;
