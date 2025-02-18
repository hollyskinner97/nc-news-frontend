import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getArticlesById, patchVotesOnArticle } from "../api";
import dayjs from "dayjs";
import "../App.css";
import CommentsList from "./CommentsList";

function ArticlePage() {
  const [article, setArticle] = useState({});
  const [votes, setVotes] = useState(0);
  const [userVote, setUserVote] = useState(0); // 0 = no vote
  const { article_id } = useParams();

  useEffect(() => {
    getArticlesById(article_id).then((article) => {
      setArticle(article);
      setVotes(article.votes);
    });
  }, [article_id]);

  if (!article) {
    return <p>Loading...</p>;
  }

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

  const formattedDate = dayjs(article.created_at).format("MMM D, YYYY");

  return (
    <div className="single-article-page">
      <div className="article-card">
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
      </div>
      <CommentsList />
    </div>
  );
}

export default ArticlePage;
