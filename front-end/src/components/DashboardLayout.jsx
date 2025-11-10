import { Navigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import App from "../App";

const DashboardLayout = ({ title, subTitle, children }) => {
  const { user, isLoggedIn, isLoading } = useAuth();

  if (isLoading) {
    console.log("Loading user id");
    return <div>Loading...sdf</div>;
  }

  if (!isLoggedIn) {
    console.log("isLoggedIn: ", isLoggedIn);
    console.log("User data: ", user);
    return <Navigate to="/" replace />;
  }

  return (
    <App>
      <div className="author-dashboard-container">
        <div className="author-dashboard-header">
          <h3>{title}</h3>
          {subTitle && <div className="sub-title">{subTitle}</div>}
        </div>

        {children}
      </div>
    </App>
  );
};

export default DashboardLayout;
