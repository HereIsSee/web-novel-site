import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import { IoIosLogIn, IoIosLogOut } from "react-icons/io";
import DefaultAvatarImage from "/avatar_default.webp";
// import DropDownMenu from "./DropDownMenu";
import Button from "./FormFields/Button";

const Header = function () {
  const { user, isLoggedIn, logout } = useAuth();
  const [showMenu, setShowMenu] = useState(false);

  const handleClick = () => {
    setShowMenu(!showMenu);
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
                    <Link to={`/profile/${user.id}`}>My Profile</Link>
                    <Link to={`/author-dashboard/${user.id}`}>
                      Author Dashboard
                    </Link>
                    <hr />
                    <Link to="/search">Search</Link>
                    <Link to="/follows">Follow List</Link>
                    <Link to="/read-later">Read Later</Link>
                    <Link to="/favorites">Favorites</Link>
                    <hr />
                    <button className="log-out" onClick={logout}>
                      <IoIosLogOut
                        style={{
                          display: "inline",
                          verticalAlign: "middle",
                          marginRight: "4px",
                          marginTop: "-3px",
                          color: "#337ab7",
                        }}
                        size="30px"
                      />
                      Log out
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <Link className="log-in" to="/login">
              <IoIosLogIn
                style={{
                  display: "inline",
                  verticalAlign: "middle",
                  marginRight: "4px",
                  marginTop: "-3px",
                }}
                size="30px"
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
