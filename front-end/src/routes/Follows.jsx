import App from "../App";
import { FaBookmark } from "react-icons/fa";
import NovelFollowCard from '../components/NovelCards/NovelFollowCard';
import SectionWrapper from '../components/SectionWrapper';

const Follows = () =>{

    return(
        <App>
            <SectionWrapper
                title="Follow List"
                Icon={FaBookmark}
            >
                <NovelFollowCard />
                <NovelFollowCard />
                <NovelFollowCard />
                <NovelFollowCard />
            </SectionWrapper>
        </App>
    );
}

export default Follows;