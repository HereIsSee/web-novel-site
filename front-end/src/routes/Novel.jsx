import NovelCover from '/the-legend-of-william-oh.png';

const Novel = ({novelData}) =>{
    
    console.log("Novel data: " + novelData);

    return(
        <div className="container">
            <div className="novel-header">
                <img src={NovelCover} alt="novel cover art"/>
                <div>
                    <div className="novel-title">Novel title</div>
                    <div className="novel-author">by Author Display Name</div>
                </div>
            </div>
            <div className="novel-info card">
                <div className="novel-tags">
                    <div className="novel-tag">LitRpg</div>
                    <div className="novel-tag">Male Lead</div>
                    <div className="novel-tag">Reincarnation</div>
                </div>
                <div className="novel-summary">
                    <p>
                        Night City, it's a place of endless wonders and horrors. 
                        Opportunities and dangers, but before Motoko Kusanagi 
                        can access any of them. She first has to build up enough 
                        strength to walk again. Learn the basics of living in a 
                        world that was just a game to her before. Good thing 
                        she found a Shard hidden in her stuff that opens the 
                        door of opportunity. But like all opportunities in Night 
                        City, it usually ends up in a gunfight.
                    </p>

                    <p>
                        Self-Insert with a modified Cyberpunk 2077 Gamer System. 
                        Not a direct Ghost in the Shell Crossover. MC just happens 
                        to share the name
                    </p>
                </div>
            </div>

            <div className="novel-statistics card">
                <h3>Statistics</h3>
                <div className="novel-statistics-container">
                    <div className="novel-statistics-star-rating">
                        <div className="metric">
                            <div className="metric-title">OVERALL SCORE :</div>
                            <div className="metric-value">5 STARS</div>
                        </div>
                        <div className="metric">
                            <div className="metric-title">STYLE SCORE :</div>
                            <div className="metric-value">5 STARS</div>
                        </div>
                        <div className="metric">
                            <div className="metric-title">STORY SCORE :</div>
                            <div className="metric-value">5 STARS</div>
                        </div>
                        <div className="metric">
                            <div className="metric-title">GRAMMAR SCORE :</div>
                            <div className="metric-value">5 STARS</div>
                        </div>
                        <div className="metric">
                            <div className="metric-title">CHARACTER SCORE :</div>
                            <div className="metric-value">5 STARS</div>
                        </div>
                    </div>
                    
                    <div className="novel-statistics-metrics">
                        <div className="metric">
                            <div className="metric-title">TOTAL VIEWS :</div>
                            <div className="metric-value">100,313</div>
                        </div>
                        <div className="metric">
                            <div className="metric-title">FOLLOWERS :</div>
                            <div className="metric-value">2003</div>
                        </div>
                        <div className="metric">
                            <div className="metric-title">FAVORITES :</div>
                            <div className="metric-value">1003</div>
                        </div>
                        <div className="metric">
                            <div className="metric-title">RATINGS :</div>
                            <div className="metric-value">1043</div>
                        </div>
                        <div className="metric">
                            <div className="metric-title">PAGES :</div>
                            <div className="metric-value">154</div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="novel-action-buttons card">
                <button>Rate it!</button>
                <button>Follow</button>
                <button>Favorite</button>
                <button>Read Later</button>
            </div>

            <div className="novel-table-of-contents card">
                <div className="novel-table-of-contents-header">
                    <h3>TABLE OF CONTENTS</h3>
                    <div>231 Chapters</div>
                </div>
                        
                <div className="novel-table-of-contents-sorting-options">
                    <button className="chapter-name-sort">Chapter Name</button>
                    <button className="release-date-sort">Release Date</button>
                </div>

                <div className="chapters">
                    <div className="chapter">
                        <div className="chapter-name">Chapter 1</div>
                        <div className="chapter-release-date"> 1 year ago</div>    
                    </div>

                    <div className="chapter">
                        <div className="chapter-name">Chapter 2</div>
                        <div className="chapter-release-date"> 1 year ago</div>    
                    </div>

                    <div className="chapter">
                        <div className="chapter-name">Chapter 3</div>
                        <div className="chapter-release-date"> 1 year ago</div>    
                    </div>

                    <div className="chapter">
                        <div className="chapter-name">Chapter 4</div>
                        <div className="chapter-release-date"> 1 year ago</div>    
                    </div>

                    <div className="chapter">
                        <div className="chapter-name">Chapter 5</div>
                        <div className="chapter-release-date"> 1 year ago</div>    
                    </div>

                    <div className="chapter">
                        <div className="chapter-name">Chapter 6</div>
                        <div className="chapter-release-date"> 1 year ago</div>    
                    </div>

                    <div className="chapter">
                        <div className="chapter-name">Chapter 7</div>
                        <div className="chapter-release-date"> 1 year ago</div>    
                    </div> 
                </div>
            </div>

            <div>Reviews</div>
        </div>
    );
}

export default Novel;