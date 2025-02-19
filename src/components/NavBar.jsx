import React, { useContext } from "react";
import { Link } from "react-router-dom";
import "../App.css";
import { UserAccount } from "../contexts/UserAccount.jsx";

function NavBar({ setOpen }) {
  const { setUsername } = useContext(UserAccount);

  return (
    <nav className="navbar">
      <Link to="/" onClick={() => setOpen(false)}>
        <button>Home</button>
      </Link>
      <Link to="/topics" onClick={() => setOpen(false)}>
        <button>All Topics</button>
      </Link>
      <Link to="/users" onClick={() => setOpen(false)}>
        <button>All Users</button>
      </Link>
      <Link to="/users/:username" onClick={() => setOpen(false)}>
        <button>Your Account</button>
      </Link>
    </nav>
  );
}

export default NavBar;
