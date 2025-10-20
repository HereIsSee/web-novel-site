import App from '../App';
import { TbStarFilled } from "react-icons/tb";
import NovelFavoriteCard from '../components/NovelCards/NovelFavoriteCard';
import SectionWrapper from '../components/SectionWrapper';


const Favorites = () =>{

    return(
        <App>
            <SectionWrapper
                title="Favorites"
                Icon={TbStarFilled}
            >
                <NovelFavoriteCard />
                <NovelFavoriteCard />
                <NovelFavoriteCard />
            </SectionWrapper>
        </App>
    );
}

export default Favorites;