import NovelCover from '/the-legend-of-william-oh.png';

const NovelHeader = () =>{

    return(
        <div className="novel-header">
            <img src={NovelCover} alt="novel cover art"/>
            <div>
                <div className="novel-title">Novel title</div>
                <div className="novel-author">by Author Display Name</div>
            </div>
        </div>
    );
}

export default NovelHeader;