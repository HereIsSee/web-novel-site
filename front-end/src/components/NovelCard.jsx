import { Link } from 'react-router';
import NovelCover from '/the-legend-of-william-oh.png';

import NovelTags from './Novel/NovelTags';
import NovelSummary from './Novel/NovelSummary';

const NovelCard = ()=>{
    return(
        <div className='novel-card'>
            <img src={NovelCover} alt="novel cover" />
            <div className='novel-card-info'>
                <h1>Novel Title</h1>
                <NovelTags />
                <div className='novel-card-statistics'>
                    <div>
                        <div>10,032 FOLLOWERS</div>
                        <div>2,223 PAGES</div>
                        <div>13 CHAPTERS</div>
                    </div>

                    <div>
                        <div>4.82 STARS</div>
                        <div>23,002 VIEWS</div>
                        <div>7/6/2023, 8:23 PM</div>
                    </div>
                </div>

                <NovelSummary />
            </div>
        </div>
    );
}
export default NovelCard;