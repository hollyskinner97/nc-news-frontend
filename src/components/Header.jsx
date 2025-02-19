import NavBar from "./NavBar";
import { useContext, useEffect, useRef, useState } from "react";
import { UserAccount } from "../contexts/UserAccount";
import "../App.css";
import { Link } from "react-router-dom";

function Header() {
  const { username } = useContext(UserAccount);
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  return (
    <div className="header">
      <p>Logged in as {username}</p>

      <h1>
        <Link to={"/"} className="home-link">
          HS News
        </Link>
      </h1>

      <div className="menu-container" ref={menuRef}>
        <button
          className="menu-btn"
          onClick={() => {
            setOpen(!open);
          }}
        >
          Menu
        </button>
        {open && <NavBar setOpen={open} />}
      </div>
    </div>
  );
}

export default Header;
