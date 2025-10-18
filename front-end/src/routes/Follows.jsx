import App from '../App';
import { FaBookmark } from "react-icons/fa";
import NovelFollowCard from '../components/NovelFollowCard';

const Follows = () =>{

    return(
        <App>
            <div className='follows-container card'>
                <div className='follows-header'>
                    <FaBookmark size='40px'/>
                    <h3>Follow List</h3>
                </div>
                <div className='follows-novels'>
                    <NovelFollowCard />
                    <NovelFollowCard />
                    <NovelFollowCard />
                    <NovelFollowCard />
                </div>
            </div>
        </App>
    );
}

export default Follows;