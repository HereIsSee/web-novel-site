import { Link } from 'react-router-dom';
import styles from './NovelCard.module.css';
import NovelCover from '/the-legend-of-william-oh.png';
import Button from '../FormFields/Button';

const NovelMiniCardLayout = ({id, title, coverUrl, children})=>{
    
    const novelSlog = 'the-legend-of-william-oh';
    
    return(
        <div className={styles['mini-novel-card']}>
            <Link to={`/novels/${id}/${novelSlog}`} className="link-with-image">
                <img src={NovelCover} alt="novel cover" />
            </Link>
            <div>
                <Link className={styles["mini-novel-card-title"]} to={`/novels/${2}/${novelSlog}`}>The Legend Of William Oh</Link>

                <div className={styles["content"]}>
                    {children}
                </div>
            </div>
        </div>
    );
}
export default NovelMiniCardLayout;
