import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { getArticles } from "../api";
import "../App.css";
import dayjs from "dayjs";

function HomePage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [articles, setArticles] = useState([]);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const topic = searchParams.get("topic");

  useEffect(() => {
    setLoading(true);
    setError(null);

    getArticles({ p: page, topic })
      .then(({ articles, total_count }) => {
        setArticles(articles);
        setTotalCount(total_count);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load articles");
        setLoading(false);
      });
  }, [page, topic]);

  if (loading) {
    return <p>Loading articles...</p>;
  }
  if (error) {
    return <p>{error}</p>;
  }

  return (
    <>
      <header className="articles-header-bar">
        <h2>Articles {topic && `on ${topic}`}</h2>
        <div className="articles-header-btns">
          <div className="sort-filter-btns">
            <button>Sort By</button>
            <button>Order (asc/desc)</button>
            <button>Filter by topic</button>
          </div>
          <button
            className="new-article-btn"
            onClick={() => {
              navigate("/articles/new");
            }}
          >
            New article!
          </button>
        </div>
      </header>

      {articles.length > 0 ? (
        <>
          <main className="article-cards">
            {articles.map((article) => {
              const formattedDate = dayjs(article.created_at).format(
                "MMM D, YYYY"
              );

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
          </main>

          <aside className="pagination-btns">
            <button
              className={"prev-pg-btn"}
              onClick={() => setPage((prev) => prev - 1)}
              disabled={page === 1}
            >
              ◀ Previous page
            </button>
            <p>Page {page}</p>
            <button
              className={"next-pg-btn"}
              onClick={() => setPage((prev) => prev + 1)}
              disabled={page * 10 >= totalCount}
            >
              Next page ▶
            </button>
          </aside>
        </>
      ) : (
        <p className="no-articles-msg">
          Sorry, there are no articles available here!
        </p>
      )}
    </>
  );
}

export default HomePage;
