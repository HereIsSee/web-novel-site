import { Link } from 'react-router-dom';
import { useState } from 'react';
import NovelCover from '/the-legend-of-william-oh.png';

import NovelTags from './Novel/NovelTags';
import NovelSummary from './Novel/NovelSummary';

const NovelCard = ()=>{
    const [showMore, setShowMore] = useState(false);
    
    const id = '21';
    const novelSlog = 'the-legend-of-william-oh';
    
    return(
        <div className='novel-card'>
            <Link to={`/novels/${id}/${novelSlog}`} className="link-with-image">
                <img src={NovelCover} alt="novel cover" />
            </Link>
            <div className='novel-card-info'>
                <Link className="novel-card-title" to={`/novels/${id}/${novelSlog}`}>Novel Title</Link>
                <NovelTags />
                <div className='novel-card-statistics'>
                    <div>
                        <div className='novel-card-statistic'>10,032 FOLLOWERS</div>
                        <div className='novel-card-statistic'>2,223 PAGES</div>
                        <div className='novel-card-statistic'>13 CHAPTERS</div>
                    </div>

                    <div>
                        <div className='novel-card-statistic'>4.82 STARS</div>
                        <div className='novel-card-statistic'>23,002 VIEWS</div>
                        <div className='novel-card-statistic'>7/6/2023, 8:23 PM</div>
                    </div>
                </div>

                {showMore && <NovelSummary />}
            </div>
            <button className="show-more"onClick={()=> setShowMore(!showMore)}>
                {showMore ? '-' : '+'}
            </button>
        </div>
    );
}
export default NovelCard;