import App from '../App';
import { TbStarFilled } from "react-icons/tb";
import NovelFavoriteCard from '../components/NovelFavoriteCard';

const Favorites = () =>{

    return(
        <App>
            <div className='follows-container card'>
                <div className='follows-header'>
                    <TbStarFilled size='40px'/>
                    <h3>Favorites</h3>
                </div>
                <div className='follows-novels'>
                    <NovelFavoriteCard />
                    <NovelFavoriteCard />
                    <NovelFavoriteCard />
                </div>
            </div>
        </App>
    );
}

export default Favorites;