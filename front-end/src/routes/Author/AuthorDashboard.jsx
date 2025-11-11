import { Link, Navigate, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAuth } from "../../context/useAuth";
import { getUserNovels } from "../../api/novel";
import { IoBookSharp, IoDocumentTextSharp } from "react-icons/io5";
import { FaPuzzlePiece, FaBookmark } from "react-icons/fa";
import { TbStarFilled } from "react-icons/tb";
import Button from "../../components/FormFields/Button";
import DefaultCover from "/default-image.png";
import DashboardLayout from "../../components/DashboardLayout";

const AuthorDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [userNovels, setUserNovels] = useState([]);
  const [authorStats, setAuthorStats] = useState({
    fictionsCount: 0,
    chaptersCount: 0,
    totalWordsCount: 0,
    reviewsCount: 0,
    followersCount: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserNovels = async () => {
      if (user == null) return;
      try {
        const authorNovels = await getUserNovels(user.id);

        setUserNovels(authorNovels);
        setAuthorStats({
          fictionsCount: authorNovels.length,
          chaptersCount: authorNovels.reduce(
            (acc, novel) => acc + novel.stats.chaptersCount,
            0,
          ),
          totalWordsCount: authorNovels.reduce(
            (acc, novel) => acc + novel.stats.wordCount,
            0,
          ),
          reviewsCount: authorNovels.reduce(
            (acc, novel) => acc + novel.stats.ratings,
            0,
          ),
          followersCount: authorNovels.reduce(
            (acc, novel) => acc + novel.stats.followsCount,
            0,
          ),
        });
        console.log(authorNovels);
      } catch (err) {
        setError(err.message);
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchUserNovels();
  }, [user]);

  // const fictionsCount =

  const onClick = () => navigate(`/author-dashboard/${user.id}/create-novel`);

  return (
    <DashboardLayout title="Author Dashboard">
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
                <div>{authorStats.fictionsCount}</div>
              </div>
            </div>

            <div className="info">
              <IoDocumentTextSharp
                size="50px"
                color="rgba(212, 212, 212, 0.76)"
              />
              <div>
                <div>Total Chapters</div>
                <div>{authorStats.chaptersCount}</div>
              </div>
            </div>

            <div className="info">
              <FaPuzzlePiece size="50px" color="rgba(212, 212, 212, 0.76)" />
              <div>
                <div>Total Words</div>
                <div>{authorStats.totalWordsCount}</div>
              </div>
            </div>

            <div className="info">
              <TbStarFilled size="50px" color="rgba(212, 212, 212, 0.76)" />
              <div>
                <div>Reviews Received</div>
                <div>{authorStats.reviewsCount}</div>
              </div>
            </div>

            <div className="info">
              <FaBookmark size="50px" color="rgba(212, 212, 212, 0.76)" />
              <div>
                <div>Followers</div>
                <div>{authorStats.followersCount}</div>
              </div>
            </div>
          </div>

          <div className="author-dashboard-novels card">
            <div className="novels">
              {userNovels.map((novel) => {
                return (
                  <div className="novel" key={novel.id}>
                    <Link
                      to={`/author-dashboard/${novel.author.id}/novel/${novel.id}/novel-info`}
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
                        to={`/author-dashboard/${novel.author.id}/novel/${novel.id}/novel-info`}
                      >
                        {novel.title}
                      </Link>
                      <div className="rating">
                        <div className="star-value">
                          {novel.stats.overallScore}
                        </div>
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
    </DashboardLayout>
  );
};

export default AuthorDashboard;
