import { Link } from 'react-router-dom';
import NovelCover from '/the-legend-of-william-oh.png';
import Button from '../FormFields/Button';

const NovelLatestUpdateCard = ({id, title, allRead=false})=>{
    
    const novelSlog = 'the-legend-of-william-oh';
    
    return(
        <div className='novel-follow-card'>
            <Link to={`/novels/${id}/${novelSlog}`} className="link-with-image">
                <img src={NovelCover} alt="novel cover" />
            </Link>
            <div className='novel-follow-card-info'>
                <Link className="novel-follow-card-title" to={`/novels/${id}/${novelSlog}`}>The Legend Of William Oh</Link>

                <div className='novel-follow-info'>
                    <div>Last Update & Last Read</div>
                    <Link className='last-update last-read' to={`/novels/${2}/chapters/${2}`}>
                        <div>Chapter Name</div>
                        <div>19 hours ago</div>
                    </Link>
                </div>

                {!allRead && (<Button styleType='blue-white' align='right'>Nex Chapter</Button>)}
            </div>
        </div>
    );
}
export default NovelLatestUpdateCard;