import { Link } from 'react-router-dom';
import styles from './NovelCard.module.css';
import NovelMiniCardLayout from './NovelMiniCardLayout';

const NovelLatestUpdateMiniCard = ({id, title, coverUrl})=>{
    
    return(
        <NovelMiniCardLayout
            id={id}
            title={title}
            coverUrl={coverUrl}
        >
            <Link className={styles['chapter']} to={`/novels/${2}/a/chapters/${2}/a`}>
                Chapter Name
            </Link>
            <Link className={styles['chapter']} to={`/novels/${2}/a/chapters/${2}/a`}>
                Chapter Name
            </Link>
        </NovelMiniCardLayout>
    );
}
export default NovelLatestUpdateMiniCard;