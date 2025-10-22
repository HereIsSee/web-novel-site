import { Link, Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import { IoBookSharp, IoDocumentTextSharp } from "react-icons/io5";
import { FaPuzzlePiece, FaBookmark } from "react-icons/fa";
import { TbStarFilled } from "react-icons/tb";
import App from "../App";
import Button from "../components/FormFields/Button";
import novelPicture from "/the-legend-of-william-oh.png";
import AuthorDashboardLayout from "../components/AuthorDashboardLayout";

const AuthorDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const onClick = () => navigate(`/author-dashboard/${user.id}/create-novel`);

  return (
    <AuthorDashboardLayout>
      <div className="author-dashboard-info card">
        <div className="info">
          <IoBookSharp size="50px" color="rgba(212, 212, 212, 0.76)" />
          <div>
            <div>Fictions</div>
            <div>0</div>
          </div>
        </div>

        <div className="info">
          <IoDocumentTextSharp size="50px" color="rgba(212, 212, 212, 0.76)" />
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
        <Button align="left" onClick={onClick} styleType="gray-blue">
          Add new
        </Button>
      </div>
    </AuthorDashboardLayout>
  );
};

export default AuthorDashboard;
