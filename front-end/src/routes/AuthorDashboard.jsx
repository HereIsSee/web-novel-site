import { Link, Navigate, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAuth } from "../context/useAuth";
import { getUserNovels } from "../api/novel";
import { IoBookSharp, IoDocumentTextSharp } from "react-icons/io5";
import { FaPuzzlePiece, FaBookmark } from "react-icons/fa";
import { TbStarFilled } from "react-icons/tb";
import App from "../App";
import Button from "../components/FormFields/Button";
import DefaultCover from "/default-image.png";
import AuthorDashboardLayout from "../components/AuthorDashboardLayout";

const AuthorDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [userNovels, setUserNovels] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserNovels = async () => {
      if (user == null) return;
      try {
        const response = await getUserNovels(user.id);

        setUserNovels(response);
        console.log(response);
      } catch (err) {
        setError(err.message);
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchUserNovels();
  }, [user]);

  const onClick = () => navigate(`/author-dashboard/${user.id}/create-novel`);

  return (
    <AuthorDashboardLayout>
      {isLoading ? (
        <div>Loading...</div>
      ) : error ? (
        <div>{error}</div>
      ) : (
        <>
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
              {userNovels.map((novel) => {
                return (
                  <div className="novel" key={novel.id}>
                    <Link
                      to={`/author-dashboard/${novel.author.id}/novel/${novel.id}`}
                      className="link-with-image"
                    >
                      <img
                        src={novel.coverImageUrl ?? DefaultCover}
                        alt="novel cover"
                      />
                    </Link>
                    <div>
                      <Link
                        className="title"
                        to={`/author-dashboard/${novel.author.id}/novel/${novel.id}`}
                      >
                        {novel.title}
                      </Link>
                      <div className="rating">
                        <div className="star-value">5</div>
                        <TbStarFilled size="20px" />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            <Button align="left" onClick={onClick} styleType="gray-blue">
              Add new
            </Button>
          </div>
        </>
      )}
    </AuthorDashboardLayout>
  );
};

export default AuthorDashboard;
