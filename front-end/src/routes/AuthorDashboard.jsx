import App from "../App";
import { IoBookSharp, IoDocumentTextSharp } from "react-icons/io5";
import { FaPuzzlePiece, FaBookmark } from "react-icons/fa";
import { TbStarFilled } from "react-icons/tb";
import Button from "../components/FormFields/Button";
import novelPicture from "/the-legend-of-william-oh.png";

const AuthorDashboard = () => {
  return (
    <App>
      <div className="author-dashboard-container">
        <div className="author-dashboard-header">
          <h3>Author Dashboard</h3>
        </div>

        <div className="author-dashboard-info card">
          <div className="info">
            <IoBookSharp size="50px" color="rgba(212, 212, 212, 0.76)" />
            <div>
              <div>Fictions</div>
              <div>0</div>
            </div>
          </div>

          <div className="info">
            <IoDocumentTextSharp
              size="50px"
              color="rgba(212, 212, 212, 0.76)"
            />
            <div>
              <div>Total Chapters</div>
              <div>0</div>
            </div>
          </div>

          <div className="info">
            <FaPuzzlePiece size="50px" color="rgba(212, 212, 212, 0.76)" />
            <div>
              <div>Total Words</div>
              <div>0</div>
            </div>
          </div>

          <div className="info">
            <TbStarFilled size="50px" color="rgba(212, 212, 212, 0.76)" />
            <div>
              <div>Reviews Received</div>
              <div>0</div>
            </div>
          </div>

          <div className="info">
            <FaBookmark size="50px" color="rgba(212, 212, 212, 0.76)" />
            <div>
              <div>Unique Followers</div>
              <div>0</div>
            </div>
          </div>
        </div>

        <div className="author-dashboard-novels card">
          <div className="novels">
            <div className="novel">
              <img src={novelPicture} alt="novel cover" />
              <div>
                <div className="title">The Legend of William Oh</div>
                <div className="rating">
                  <div className="star-value">5</div>
                  <TbStarFilled size="20px" />
                </div>
              </div>
            </div>

            <div className="novel">
              <img src={novelPicture} alt="novel cover" />
              <div>
                <div className="title">The Legend of William Oh</div>
                <div className="rating">
                  <div className="star-value">5</div>
                  <TbStarFilled size="20px" />
                </div>
              </div>
            </div>

            <div className="novel">
              <img src={novelPicture} alt="novel cover" />
              <div>
                <div className="title">The Legend of William Oh</div>
                <div className="rating">
                  <div className="star-value">5</div>
                  <TbStarFilled size="20px" />
                </div>
              </div>
            </div>

            <div className="novel">
              <img src={novelPicture} alt="novel cover" />
              <div>
                <div className="title">The Legend of William Oh</div>
                <div className="rating">
                  <div className="star-value">5</div>
                  <TbStarFilled size="20px" />
                </div>
              </div>
            </div>
          </div>
          <Button styleType="gray-blue">Add new</Button>
        </div>
      </div>
    </App>
  );
};

export default AuthorDashboard;
