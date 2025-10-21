const NovelStatistics = () => {
  return (
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
  );
};

export default NovelStatistics;
