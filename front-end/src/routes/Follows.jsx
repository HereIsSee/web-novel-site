import { FaBookmark } from "react-icons/fa";
import NovelFollowCard from '../components/NovelFollowCard';
import SectionWrapper from '../components/SectionWrapper';

const Follows = () =>{

    return(
        <SectionWrapper
            title="Follow List"
            Icon={FaBookmark}
        >
            <NovelFollowCard />
            <NovelFollowCard />
            <NovelFollowCard />
            <NovelFollowCard />
        </SectionWrapper>
    );
}

export default Follows;