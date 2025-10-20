import { Link } from 'react-router-dom';
import styles from './NovelCard.module.css';
import NovelMiniCard from './NovelMiniCard';

const NovelLatestUpdateMiniCard = ({id, title, coverUrl})=>{
    
    return(
        <NovelMiniCard
            id={id}
            title={title}
            coverUrl={coverUrl}
        >
            <Link className={styles['chapter']} to={`/novels/${2}/chapters/${2}`}>
                Chapter Name
            </Link>
            <Link className={styles['chapter']} to={`/novels/${2}/chapters/${2}`}>
                Chapter Name
            </Link>
        </NovelMiniCard>
    );
}
export default NovelLatestUpdateMiniCard;