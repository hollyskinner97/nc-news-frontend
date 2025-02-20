import { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserAccount } from "../contexts/UserAccount";
import "../App.css";
import { getTopics, postArticle } from "../api";
import LoadingPage from "./LoadingPage";
import ErrorHandler from "./ErrorHandler";

function NewArticlePage({ setArticles }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successful, setSuccessful] = useState(false);
  const [topics, setTopics] = useState([]);
  const [formInfo, setFormInfo] = useState({
    title: "",
    body: "",
    topic: "",
    article_img_url: "",
  });
  const [validForm, setValidForm] = useState(true);
  const { username } = useContext(UserAccount);
  const navigate = useNavigate();

  useEffect(() => {
    getTopics().then((topicsData) => setTopics(topicsData));
  }, []);

  function handleChange(e) {
    const { id, value } = e.target;

    setSuccessful(false);
    setFormInfo((curr) => ({
      ...curr,
      author: username,
      [id]: value,
    }));
    setError(null);
  }

  function handleSubmit(e) {
    e.preventDefault();

    if (
      formInfo.title.trim() === "" ||
      formInfo.body.trim() === "" ||
      formInfo.topic === ""
    ) {
      setValidForm(false);
      return;
    }

    setLoading(true);

    // Remove article_img_url if empty, so it defaults
    const articleData = { ...formInfo };
    if (!articleData.article_img_url.trim()) {
      delete articleData.article_img_url;
    }

    postArticle(articleData)
      .then((newArticle) => {
        setArticles((prevArticles) => [...prevArticles, newArticle]);
        setSuccessful(true);
        setError(null);
        navigate(`/articles/${newArticle.article_id}`);
      })
      .catch((err) => {
        setError(err);
      })
      .finally(() => {
        setLoading(false);
      });
  }

  function handleDiscard(e) {
    e.preventDefault();
    setFormInfo({
      title: "",
      body: "",
      topic: "",
      article_img_url: "",
    });
    setError(null);
  }

  if (loading) {
    return <LoadingPage message={"Loading new article form..."} />;
  }
  if (error) {
    return <ErrorHandler message={error.message} />;
  }

  return (
    <main className="new-article-form">
      <h2>Write a new article...</h2>
      <form>
        <div className="article-input-container">
          <label htmlFor="title">Title*:</label>
          <input
            type="text"
            id="title"
            value={formInfo.title}
            placeholder="Write your article title here..."
            onChange={handleChange}
            required
          />
        </div>
        <div className="article-input-container">
          <label htmlFor="body">Content*:</label>
          <input
            type="text"
            id="body"
            value={formInfo.body}
            placeholder="Write your article content here..."
            onChange={handleChange}
            required
          />
        </div>
        <div className="article-input-container">
          <label htmlFor="article_img_url">Image Link:</label>
          <input
            type="text"
            id="article_img_url"
            value={formInfo.aritcle_img_url}
            placeholder="Add a link to your article image here..."
            onChange={handleChange}
          />
        </div>
        <div className="article-input-container">
          <label htmlFor="topic">Topic*:</label>
          <select
            id="topic"
            className="new-article-dropdown"
            onChange={handleChange}
            value={formInfo.topic}
            required
          >
            <option value="" disabled>
              Select a topic
            </option>
            {topics.map((topic) => (
              <option key={topic.slug} value={topic.slug}>
                {topic.slug}
              </option>
            ))}
          </select>
        </div>
        <p>* = Required field</p>
        {!validForm && (
          <p className="err-message">
            Please make sure all required fields are completed.
          </p>
        )}

        <div className="new-article-form-btns">
          <button className="new-article-form-btn" onClick={handleSubmit}>
            Post article
          </button>
          <button className="cancel-article-btn" onClick={handleDiscard}>
            Discard
          </button>
        </div>
        {successful && (
          <strong>
            <p className="success-message">Article posted successfully!</p>
          </strong>
        )}
      </form>
    </main>
  );
}

export default NewArticlePage;
