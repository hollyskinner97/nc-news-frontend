import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../App.css";
import { getTopics } from "../api";
import NewTopicForm from "./NewTopicForm";

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
      .catch(() => {
        setError("Failed to load topics");
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <p>Loading topics...</p>;
  }

  return (
    <>
      <div className="topics-bar">
        <NewTopicForm setTopics={setTopics} />
        {error && <p className="err-message">{error}</p>}
      </div>

      <div className="topics-cards">
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
      </div>
    </>
  );
}

export default TopicsPage;
