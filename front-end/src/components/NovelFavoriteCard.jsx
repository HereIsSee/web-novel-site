import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import NovelCover from '/the-legend-of-william-oh.png';
import Button from './FormFields/Button';

const NovelFavoriteCard = ({id})=>{
    const [expanded, setExpanded] = useState(false);
    const [isOverflowing, setIsOverflowing] = useState(false);
    const summaryRef = useRef(null);
    
    const novelSlog = 'the-legend-of-william-oh';
    
    useEffect(()=>{
        const el = summaryRef.current;
        if(el){
            requestAnimationFrame(() => {
                setIsOverflowing(el.scrollHeight > el.clientHeight);
            });
        }
    },[])
    
    return(
        <div className='novel-favorite-card collapsed'>
            <Link to={`/novels/${2}/${novelSlog}`} className="link-with-image">
                <img src={NovelCover} alt="novel cover" />
            </Link>
            <div className='novel-favorite-card-info'>
                <Link className="novel-favorite-card-title" to={`/novels/${2}/${novelSlog}`}>The Legend Of William Oh</Link>

                <div className='novel-favorite-info'>
                    <div className='pages-number'>
                        1851 PAGES
                    </div>
                    <div className='novel-favorite-author'>
                        by <span>Macronomicon</span>
                    </div>
                </div>

                <div 
                    ref={summaryRef} 
                    className={`novel-summary ${expanded ? 'expanded' : 'collapsed'}`}
                >
                    <p>
                        Listen here, because I've seen it with my very own eyes.
                    </p>

                </div>

                {isOverflowing && (
                    <Button 
                        styleType='white-text-only'
                        onClick={() => setExpanded(!expanded)}
                    >
                        {expanded ? 'Show Less' : 'Show More'}
                    </Button>
                )}

                <Button styleType='red-white'>
                    Unfavorite
                </Button>
            </div>
        </div>
    );
}
export default NovelFavoriteCard;