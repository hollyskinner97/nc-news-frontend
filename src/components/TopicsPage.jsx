import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../App.css";
import { getTopics } from "../api";
import NewTopicForm from "./NewTopicForm";
import LoadingPage from "./LoadingPage";
import ErrorHandler from "./ErrorHandler";

function TopicsPage() {
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);

    getTopics()
      .then((topics) => {
        setTopics(topics);
        setLoading(false);
      })
      .catch((err) => {
        setError(err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <LoadingPage message={"Loading topics..."} />;
  }

  if (error) {
    return <ErrorHandler message={error.message} />;
  }

  return (
    <>
      <header className="topics-bar">
        <NewTopicForm setTopics={setTopics} />
      </header>

      <main className="topics-cards">
        {topics.map((topic) => {
          return (
            <div className="topic-card" key={topic.slug}>
              <h2>
                <Link
                  to={`/articles?topic=${topic.slug}`}
                  className="article-link"
                >
                  {topic.slug}
                </Link>
              </h2>
              <p>{topic.description}</p>
            </div>
          );
        })}
      </main>
    </>
  );
}

export default TopicsPage;
