import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import App from "../App";
import Button from "../components/FormFields/Button";
import novelPicture from "/the-legend-of-william-oh.png";

const AuthorDashboardLayout = ({ subTitle, children }) => {
  const { user, isLoggedIn } = useAuth();
  const navigate = useNavigate();

  if (!isLoggedIn) return <Navigate to="/" replace />;

  return (
    <App>
      <div className="author-dashboard-container">
        <div className="author-dashboard-header">
          <h3>Author Dashboard</h3>
          {subTitle && <div className="sub-title">{subTitle}</div>}
        </div>

        {children}
      </div>
    </App>
  );
};

export default AuthorDashboardLayout;
