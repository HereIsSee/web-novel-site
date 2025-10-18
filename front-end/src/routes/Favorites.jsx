import App from '../App';
import { TbStarFilled } from "react-icons/tb";
import NovelFavoriteCard from '../components/NovelFavoriteCard';
import SectionWrapper from '../components/SectionWrapper';


const Favorites = () =>{

    return(
        <SectionWrapper
            title="Favorites"
            Icon={TbStarFilled}
        >
            <NovelFavoriteCard />
            <NovelFavoriteCard />
            <NovelFavoriteCard />
        </SectionWrapper>
    );
}

export default Favorites;