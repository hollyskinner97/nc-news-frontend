import { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../App.css";
import { UserAccount } from "../contexts/UserAccount";
import { getUserByUsername } from "../api";
import LoadingPage from "./LoadingPage";
import ErrorHandler from "./ErrorHandler";

function AccountPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState({});
  const { username } = useContext(UserAccount);

  useEffect(() => {
    setLoading(true);

    getUserByUsername(username)
      .then((user) => {
        setUser(user);
        setLoading(false);
      })
      .catch((err) => {
        setError(err);
        setLoading(false);
      });
  }, [username]);

  if (loading) {
    return <LoadingPage message={"Loading user..."} />;
  }

  if (error) {
    return <ErrorHandler message={error.message} />;
  }

  return (
    <main className="single-user-page">
      <section className="user-card">
        <h2>{user.username}</h2>
        <p>{user.name}</p>
        <img src={user.avatar_url} alt={user.username} />
      </section>
    </main>
  );
}

export default AccountPage;
