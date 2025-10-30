const NovelStatistics = ({ novelStats }) => {
  return (
    <div className="novel-statistics card">
      <h3>Statistics</h3>
      <div className="novel-statistics-container">
        <div className="novel-statistics-star-rating">
          <div className="metric">
            <div className="metric-title">OVERALL SCORE :</div>
            <div className="metric-value">{novelStats.overallScore} STARS</div>
          </div>
          <div className="metric">
            <div className="metric-title">STYLE SCORE :</div>
            <div className="metric-value">{novelStats.styleScore} STARS</div>
          </div>
          <div className="metric">
            <div className="metric-title">STORY SCORE :</div>
            <div className="metric-value">{novelStats.storyScore} STARS</div>
          </div>
          <div className="metric">
            <div className="metric-title">GRAMMAR SCORE :</div>
            <div className="metric-value">{novelStats.grammarScore} STARS</div>
          </div>
          <div className="metric">
            <div className="metric-title">CHARACTER SCORE :</div>
            <div className="metric-value">
              {novelStats.characterScore} STARS
            </div>
          </div>
        </div>

        <div className="novel-statistics-metrics">
          <div className="metric">
            <div className="metric-title">TOTAL VIEWS :</div>
            <div className="metric-value">{novelStats.views}</div>
          </div>
          <div className="metric">
            <div className="metric-title">FOLLOWERS :</div>
            <div className="metric-value">{novelStats.followsCount}</div>
          </div>
          <div className="metric">
            <div className="metric-title">FAVORITES :</div>
            <div className="metric-value">{novelStats.favoritesCount}</div>
          </div>
          <div className="metric">
            <div className="metric-title">RATINGS :</div>
            <div className="metric-value">{novelStats.ratings}</div>
          </div>
          <div className="metric">
            <div className="metric-title">PAGES :</div>
            <div className="metric-value">
              {Math.ceil(novelStats.wordCount / 275)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NovelStatistics;
