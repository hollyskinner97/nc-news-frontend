import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getArticles } from "../api";
import "../App.css";
import dayjs from "dayjs";

function HomePage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [articles, setArticles] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);

    getArticles()
      .then((articles) => {
        setArticles(articles);
        setLoading(false);
      })
      .catch((err) => {
        setError("Failed to load articles");
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <p>Loading articles...</p>;
  }
  if (error) {
    return <p>{error}</p>;
  }

  return (
    <>
      {/* Need to add filters/sort here */}
      <div className="articles-btn-bar">
        <button>Sort By</button>
        <button>Order (asc/desc)</button>
        <button>Filter by topic</button>
        <button
          className="new-article-btn"
          onClick={() => {
            navigate("/articles/new");
          }}
        >
          New article!
        </button>
      </div>
      <div className="article-cards">
        {articles.map((article) => {
          const formattedDate = dayjs(article.created_at).format("MMM D, YYYY");

          return (
            <div className="article-card" key={article.article_id}>
              <img src={article.article_img_url} alt={article.title} />
              <h2>
                <Link
                  to={`/articles/${article.article_id}`}
                  className="article-link"
                >
                  {article.title}
                </Link>
              </h2>
              <p>Author: {article.author}</p>
              <p>Topic: {article.topic}</p>
              <p>{formattedDate}</p>
              <button
                onClick={() => {
                  navigate(`/articles/${article.article_id}`);
                }}
              >
                Read article...
              </button>
            </div>
          );
        })}
      </div>
    </>
  );
}

export default HomePage;
