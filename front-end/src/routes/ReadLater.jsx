import { IoBookSharp } from "react-icons/io5";
import NovelReadLaterCard from '../components/NovelReadLaterCard';
import SectionWrapper from '../components/SectionWrapper';
const ReadLater = () =>{

    return(
        <SectionWrapper
            title="Read Later"
            Icon={IoBookSharp}
        >
            <NovelReadLaterCard />
            <NovelReadLaterCard />
            <NovelReadLaterCard />
                
        </SectionWrapper>
    );
}

export default ReadLater;