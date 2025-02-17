import React, { useContext } from "react";
import { Link } from "react-router-dom";
import "../App.css";
import { UserAccount } from "../contexts/UserAccount.jsx";

function NavBar() {
  const { setUsername } = useContext(UserAccount);

  return (
    <nav className="navbar">
      <Link to="/">
        <button>Home</button>
      </Link>
      <Link to="/topics">
        <button>All Topics</button>
      </Link>
      <Link to="/users">
        <button>All Users</button>
      </Link>
      <Link to="/users/:username">
        <button>Your Account</button>
      </Link>
    </nav>
  );
}

export default NavBar;
