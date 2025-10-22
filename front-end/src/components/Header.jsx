import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import { useToast } from "../context/useToast";
import {
  IoIosLogIn,
  IoIosLogOut,
  IoMdSearch,
  IoIosBookmark,
  IoIosStar,
} from "react-icons/io";
import { AiOutlineClockCircle } from "react-icons/ai";
import { HiOutlinePencil } from "react-icons/hi";
import { MdPerson } from "react-icons/md";
import DefaultAvatarImage from "/avatar_default.webp";
import Button from "./FormFields/Button";

const iconStyles = {
  display: "inline",
  verticalAlign: "middle",
  marginRight: "4px",
  marginTop: "-3px",
  color: "#1988e9ff",
};
const iconSize = "30px";

const Header = function () {
  const { user, isLoggedIn, logout } = useAuth();
  const [showMenu, setShowMenu] = useState(false);
  const { showToast } = useToast();

  const handleClick = () => {
    setShowMenu(!showMenu);
  };
  const onClick = () => {
    logout();
    showToast("Logout successful!", "success");
  };

  return (
    <header>
      <nav>
        <Link className="logo" to="/">
          FableBound
        </Link>

        <div className="options">
          {/* <img src={DefaultAvatarImage} alt="user image" /> */}
          {isLoggedIn ? (
            <>
              <div className="display-name">{user.username}</div>
              <div className="drop-down-menu-container">
                <Button styleType="text-only-gray" onClick={handleClick}>
                  ☰
                </Button>
                {showMenu && (
                  <div className="drop-down-menu">
                    <div className="arrow" />
                    <Link className="menu-option" to={`/profile/${user.id}`}>
                      <MdPerson style={iconStyles} size={iconSize} />
                      My Profile
                    </Link>
                    <Link
                      className="menu-option"
                      to={`/author-dashboard/${user.id}`}
                    >
                      <HiOutlinePencil style={iconStyles} size={iconSize} />
                      Author Dashboard
                    </Link>
                    <hr />
                    <Link className="menu-option" to="/search">
                      <IoMdSearch style={iconStyles} size={iconSize} />
                      Search
                    </Link>
                    <Link className="menu-option" to="/follows">
                      <IoIosBookmark style={iconStyles} size={iconSize} />
                      Follow List
                    </Link>
                    <Link className="menu-option" to="/read-later">
                      <AiOutlineClockCircle
                        style={iconStyles}
                        size={iconSize}
                      />
                      Read Later
                    </Link>
                    <Link className="menu-option" to="/favorites">
                      <IoIosStar style={iconStyles} size={iconSize} />
                      Favorites
                    </Link>
                    <hr />
                    <button className="log-out menu-option" onClick={onClick}>
                      <IoIosLogOut style={iconStyles} size={iconSize} />
                      Log out
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <Link className="log-in" to="/login">
              <IoIosLogIn
                style={{ ...iconStyles, color: "inherit" }}
                size={iconSize}
              />
              Log In
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Header;
