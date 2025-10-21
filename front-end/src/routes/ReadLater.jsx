import App from "../App";
import { IoBookSharp } from "react-icons/io5";
import NovelReadLaterCard from "../components/NovelCards/NovelReadLaterCard";
import SectionWrapper from "../components/SectionWrapper";
const ReadLater = () => {
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
