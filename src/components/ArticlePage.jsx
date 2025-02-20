import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getArticlesById, patchVotesOnArticle } from "../api";
import dayjs from "dayjs";
import "../App.css";
import CommentsList from "./CommentsList";
import LoadingPage from "./LoadingPage";
import ErrorHandler from "./ErrorHandler";

function ArticlePage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [article, setArticle] = useState({});
  const [votes, setVotes] = useState(0);
  const [userVote, setUserVote] = useState(0); // 0 = no vote
  const { article_id } = useParams();

  useEffect(() => {
    setLoading(true);

    getArticlesById(article_id)
      .then((article) => {
        setArticle(article);
        setVotes(article.votes);
        setLoading(false);
      })
      .catch((err) => {
        setError(err);
        setLoading(false);
      });
  }, [article_id]);

  function handleVote(inc) {
    const newVote = userVote === inc ? 0 : inc;

    // Optimistic render
    setVotes((prevVotes) => prevVotes - userVote + newVote);
    setUserVote(newVote);

    patchVotesOnArticle(article_id, { inc_votes: newVote })
      .then(() => {})
      .catch((err) => {
        // If req fails then revert the vote
        setVotes((prevVotes) => prevVotes - newVote);
        setUserVote(0);
        alert(
          "Something went wrong while updating your vote. Please try again."
        );
      });
  }

  if (loading) {
    return <LoadingPage message={"Loading article..."} />;
  }

  if (error) {
    return <ErrorHandler message={error.message} />;
  }

  const formattedDate = dayjs(article.created_at).format("MMM D, YYYY");

  return (
    <main className="single-article-page">
      <section className="article-card">
        <h2>{article.title}</h2>
        <img src={article.article_img_url} alt={article.title} />
        <p>Author: {article.author}</p>
        <p>Topic: {article.topic}</p>
        <p>{formattedDate}</p>
        <p>{article.body}</p>
        <p>Votes: {votes}</p>
        <div className="vote-btns">
          <button
            className={`vote-button ${userVote === 1 ? "voted" : ""}`}
            onClick={() => handleVote(1)}
          >
            {userVote === 1 ? "Remove vote" : "Up vote!"}
          </button>
          <button
            className={`vote-button ${userVote === -1 ? "voted" : ""}`}
            onClick={() => handleVote(-1)}
          >
            {userVote === -1 ? "Remove vote" : "Down vote!"}
          </button>
        </div>
      </section>
      <CommentsList />
    </main>
  );
}

export default ArticlePage;
