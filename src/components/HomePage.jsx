import { useContext, useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { deleteArticle, getArticles } from "../api";
import ArticlesHeader from "./ArticlesHeader";
import ErrorHandler from "./ErrorHandler";
import LoadingPage from "./LoadingPage";
import dayjs from "dayjs";
import "../App.css";
import { UserAccount } from "../contexts/UserAccount";

function HomePage({ articles, setArticles }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [deleting, setDeleting] = useState(false);
  const { username } = useContext(UserAccount);
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // Get initial values from searchParams and set state
  const [sortBy, setSortBy] = useState(
    searchParams.get("sort_by") || "created_at"
  );
  const [order, setOrder] = useState(searchParams.get("order") || "asc");
  const [topic, setTopic] = useState(searchParams.get("topic") || "");

  useEffect(() => {
    setLoading(true);
    setError(null);

    getArticles({ p: page, sort_by: sortBy, order, topic })
      .then(({ articles, total_count }) => {
        setArticles(articles);
        setTotalCount(total_count);
        setLoading(false);
      })
      .catch((err) => {
        setError(err);
        setLoading(false);
        // "Failed to load articles"
      });
  }, [page, sortBy, order, topic]);

  // Update searchParams whenever state changes
  useEffect(() => {
    const params = new URLSearchParams();
    if (sortBy !== "created_at") params.set("sort_by", sortBy);
    if (order !== "asc") params.set("order", order);
    if (topic) params.set("topic", topic);

    setSearchParams(params);
  }, [sortBy, order, topic, setSearchParams]);

  function handleDelete(article_id) {
    if (deleting) return;
    setDeleting(true);
    setError(null);

    const articleToDelete = articles.find(
      (article) => article.article_id === article_id
    );

    setArticles((prevArticles) =>
      prevArticles.filter((article) => article.article_id !== article_id)
    );

    deleteArticle(article_id)
      .then(() => {
        alert("Article successfully deleted");
      })
      .catch((err) => {
        setError(err);
        // Restore the article if delete fails
        setArticles((prevArticles) => [...prevArticles, articleToDelete]);
      });
  }

  if (loading) {
    return <LoadingPage message={"Loading articles..."} />;
  }

  if (error) {
    return <ErrorHandler message={error.message} />;
  }

  return (
    <>
      <ArticlesHeader
        sortBy={sortBy}
        setSortBy={setSortBy}
        order={order}
        setOrder={setOrder}
        topic={topic}
        setTopic={setTopic}
      />

      {articles.length > 0 ? (
        <>
          <main className="article-cards">
            {articles.map((article) => {
              const formattedDate = dayjs(article.created_at).format(
                "MMM D, YYYY"
              );

              return (
                <section className="article-card" key={article.article_id}>
                  <img src={article.article_img_url} alt={article.title} />
                  <Link
                    to={`/articles/${article.article_id}`}
                    className="article-link"
                  >
                    <h2>{article.title}</h2>
                  </Link>
                  <p>Author: {article.author}</p>
                  <p>Topic: {article.topic}</p>
                  <p>Votes: {article.votes}</p>
                  <p>{formattedDate}</p>
                  <div className="article-card-btns">
                    <button
                      onClick={() => {
                        navigate(`/articles/${article.article_id}`);
                      }}
                    >
                      Read article...
                    </button>
                    {article.author === username && (
                      <button
                        className="delete-btn"
                        onClick={() => handleDelete(article.article_id)}
                      >
                        Delete
                      </button>
                    )}
                  </div>
                </section>
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
          Sorry, there are no articles available here! Click the 'New article!'
          button above to write your own.
        </p>
      )}
    </>
  );
}

export default HomePage;
