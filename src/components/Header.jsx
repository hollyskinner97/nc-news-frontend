import NavBar from "./NavBar";
import { useContext, useEffect, useRef, useState } from "react";
import { UserAccount } from "../contexts/UserAccount";
import "../App.css";
import { useNavigate } from "react-router-dom";

function Header() {
  const { username } = useContext(UserAccount);
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();

  // Navigate to home page and reset filters when title clicked
  function handleTitleClick() {
    navigate("/", { replace: true });
    window.location.reload();
  }

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
    <header className="header">
      <p className="logged-in-msg">Logged in as {username}</p>

      <h1 className="app-title" onClick={handleTitleClick}>
        HS News
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
    </header>
  );
}

export default Header;
