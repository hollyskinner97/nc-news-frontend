import { useContext, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import "../App.css";
import { postComment, postTopic } from "../api";
import { UserAccount } from "../contexts/UserAccount";

function NewTopicForm({ setTopics }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [successful, setSuccessful] = useState(false);
  const [formInfo, setFormInfo] = useState({
    slug: "",
    description: "",
  });

  function handleChange(e) {
    const { id, value } = e.target;

    setSuccessful(false);
    setFormInfo((curr) => ({
      ...curr,
      [id]: value,
    }));
    setError(false);
  }

  function handleSubmit(e) {
    e.preventDefault();

    if (formInfo.slug.trim() === "" || formInfo.description.trim() === "") {
      setError(true);
      return;
    }

    setLoading(true);
    postTopic(formInfo)
      .then((newTopic) => {
        setTopics((prevTopics) => [...prevTopics, newTopic]);
        // Reset form
        setFormInfo({
          slug: "",
          description: "",
        });
        setSuccessful(true);
        setError(false);
      })
      .catch(() => {
        setError(true);
      })
      .finally(() => {
        setLoading(false);
      });
  }

  function handleDiscard(e) {
    e.preventDefault();
    setFormInfo({
      slug: "",
      description: "",
    });
    setError(false);
  }

  if (loading) {
    return <p>Loading new topic form...</p>;
  }

  return (
    <>
      <div className="new-topic-form">
        <h3>Want to add a new topic?</h3>
        <form>
          <div className="input-container">
            <label htmlFor="slug">Topic:</label>
            <input
              type="text"
              id="slug"
              value={formInfo.slug}
              placeholder="Write your topic name here..."
              onChange={handleChange}
              required
            />
          </div>
          <div className="input-container">
            <label htmlFor="description">Description:</label>
            <input
              type="text"
              id="description"
              value={formInfo.description}
              placeholder="Write a topic description here..."
              onChange={handleChange}
              required
            />
          </div>
          {error && (
            <p className="err-message">
              Please enter a valid topic. Both the topic name and description
              are required.
            </p>
          )}

          <div className="topic-form-btns">
            <button className="topic-form-btn" onClick={handleSubmit}>
              Add topic
            </button>
            <button className="cancel-topic-btn" onClick={handleDiscard}>
              Discard
            </button>
          </div>
          {successful && (
            <strong>
              <p className="success-message">Topic added successfully!</p>
            </strong>
          )}
        </form>
      </div>
    </>
  );
}

export default NewTopicForm;
