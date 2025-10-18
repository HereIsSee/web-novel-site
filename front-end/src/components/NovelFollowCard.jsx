import { Link } from 'react-router-dom';
import NovelCover from '/the-legend-of-william-oh.png';
import Button from './FormFields/Button';

const NovelFollowCard = ({id, title, allRead=false})=>{
    
    const novelSlog = 'the-legend-of-william-oh';
    
    return(
        <div className='novel-follow-card'>
            <Link to={`/novels/${id}/${novelSlog}`} className="link-with-image">
                <img src={NovelCover} alt="novel cover" />
            </Link>
            <div className='novel-follow-card-info'>
                <Link className="novel-follow-card-title" to={`/novels/${id}/${novelSlog}`}>The Legend Of William Oh</Link>

                <div className='novel-follow-info'>
                    {allRead ? (
                        <> 
                            <div>Last Update & Last Read</div>
                            <Link className='last-update last-read' to={`/novels/${2}/chapters/${2}`}>
                                <div>Chapter Name</div>
                                <div>19 hours ago</div>
                            </Link>
                        </>
                    ) : (
                        <>
                            <div>Last Update</div>
                            <Link className='last-update' to={`/novels/${2}/chapters/${2}`}>
                                <div>Chapter Name</div>
                                <div>19 hours ago</div>
                            </Link>

                            <div>Last Read Chapter</div>
                            <Link className='last-read' to={`/novels/${2}/chapters/${2}`}>
                                <div>Chapter Name</div>
                                <div>19 hours ago</div>
                            </Link>

                            <div className="novel-follow-author">
                                by <span>Macronomicon</span>
                            </div>
                        </>
                    )}
                </div>

                {!allRead && (<Button styleType='blue-white' align='right'>Nex Chapter</Button>)}
            </div>
        </div>
    );
}
export default NovelFollowCard;