import NovelCover from '/the-legend-of-william-oh.png';

const NovelHeader = ({title, author}) =>{

    return(
        <div className="novel-header">
            <img src={NovelCover} alt="novel cover art"/>
            <div>
                <div className="novel-title">{title}</div>
                <div className="novel-author">by {author}</div>
            </div>
        </div>
    );
}

export default NovelHeader;