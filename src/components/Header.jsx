import NavBar from "./NavBar";
import { useContext, useState } from "react";
import "../App.css";
import { UserAccount } from "../contexts/UserAccount";

function Header() {
  const { username } = useContext(UserAccount);
  const [open, setOpen] = useState(false);

  return (
    <div className="header">
      <p>Logged in as {username}</p>
      <h1>HS News</h1>
      <div className="menu-container">
        <button
          className="menu-btn"
          onClick={() => {
            setOpen(!open);
          }}
        >
          Menu
        </button>
        {open ? <NavBar /> : null}
      </div>
    </div>
  );
}

export default Header;
