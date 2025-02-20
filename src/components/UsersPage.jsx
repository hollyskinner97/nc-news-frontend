import { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import LoadingPage from "./LoadingPage";
import ErrorHandler from "./ErrorHandler";
import "../App.css";
import { getUsers } from "../api";
import { UserAccount } from "../contexts/UserAccount";

function UsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { username } = useContext(UserAccount);

  useEffect(() => {
    setLoading(true);

    getUsers()
      .then((users) => {
        setUsers(users);
        setLoading(false);
      })
      .catch((err) => {
        setError(err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <LoadingPage message={"Loading users..."} />;
  }

  if (error) {
    return <ErrorHandler message={error.message} />;
  }

  return (
    <>
      <main className="user-cards">
        {users.map((user) => {
          const isLoggedIn = user.username === username;
          return (
            <div
              className={`user-card ${isLoggedIn ? "logged-in" : ""}`}
              key={user.username}
            >
              {isLoggedIn && <div className="badge">Me!</div>}
              <Link to={`/users/${user.username}`} className="user-link">
                <h2>{user.username}</h2>
                <img src={user.avatar_url} alt={user.username} />
              </Link>
              <p>{user.name}</p>
            </div>
          );
        })}
      </main>
    </>
  );
}

export default UsersPage;
