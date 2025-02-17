import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getArticlesById } from "../api";
import dayjs from "dayjs";
import "../App.css";
import CommentsList from "./CommentsList";

function ArticlePage() {
  const [article, setArticle] = useState({});
  const { article_id } = useParams();

  useEffect(() => {
    getArticlesById(article_id).then((article) => {
      setArticle(article);
    });
  }, [article_id]);

  if (!article) {
    return <p>Loading...</p>;
  }

  const formattedDate = dayjs(article.created_at).format("MMM D, YYYY");

  return (
    <div className="single-article-page">
      <div className="article-card">
        <h2>{article.title}</h2>
        <p>Author: {article.author}</p>
        <p>Topic: {article.topic}</p>
        <p>{formattedDate}</p>
        <p>{article.body}</p>
        <p>Votes: {article.votes}</p>
        {/* Need to add vote button, comments etc. */}
      </div>
      <CommentsList />
    </div>
  );
}

export default ArticlePage;
