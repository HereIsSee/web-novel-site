import { useNavigate, useParams, Link, Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import { getNovel, deleteNovel } from "../../api/novel";
import { getNovelChapters, deleteChapter } from "../../api/chapter";
import { formatDateTime, timeAgo } from "../../helpers/timeFormating";
import styles from "./Admin.module.css";
import DashboardLayout from "../../components/DashboardLayout";
import { useToast } from "../../context/useToast";

import { FaUsers, FaComments, FaBook } from "react-icons/fa";
import { TbStarsFilled } from "react-icons/tb";
import { FaBookOpen } from "react-icons/fa6";

import ConfirmationModule from "../../components/ConfirmationModule/ConfimationModule";

const iconStyles = {
  display: "inline",
  verticalAlign: "middle",
  marginRight: "20px",
  color: "inherit",
};
const iconSize = "30px";

const AuthorNovel = () => {
  const [selected, setSelected] = useState("users");

  return (
    <DashboardLayout title="Admin Dashboard">
      <div className={styles.container}>
        <div className={styles.sidebar}>
          <Link
            className={selected === "users" ? styles.selected : ""}
            onClick={() => setSelected("users")}
            to="/admin-dashboard/users"
          >
            <FaUsers style={iconStyles} size={iconSize} />
            Users
          </Link>
          <Link
            className={selected === "comments" ? styles.selected : ""}
            onClick={() => setSelected("comments")}
            to="/admin-dashboard/comments"
          >
            <FaComments style={iconStyles} size={iconSize} />
            Comments
          </Link>
          <Link
            className={selected === "reviews" ? styles.selected : ""}
            onClick={() => setSelected("reviews")}
            to="/admin-dashboard/reviews"
          >
            <TbStarsFilled style={iconStyles} size={iconSize} />
            Reviews
          </Link>
          <Link
            className={selected === "novels" ? styles.selected : ""}
            onClick={() => setSelected("novels")}
            to="/admin-dashboard/novels"
          >
            <FaBook style={iconStyles} size={iconSize} />
            Novels
          </Link>
          <Link
            className={selected === "chapters" ? styles.selected : ""}
            onClick={() => setSelected("chapters")}
            to="/admin-dashboard/chapters"
          >
            <FaBookOpen style={iconStyles} size={iconSize} />
            Chapers
          </Link>
        </div>
        <div className={styles.searchContainer}>
          <Outlet />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AuthorNovel;
