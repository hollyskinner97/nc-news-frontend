import { useContext, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import "../App.css";
import { postComment } from "../api";
import { UserAccount } from "../contexts/UserAccount";

function NewCommentForm({ setComments }) {
  const { username } = useContext(UserAccount);
  const { article_id } = useParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [successful, setSuccessful] = useState(false);
  const [formInfo, setFormInfo] = useState({
    username: username,
    body: "",
  });

  function handleChange(e) {
    setSuccessful(false);
    setFormInfo((curr) => ({
      ...curr,
      body: e.target.value,
    }));
    setError(false);
  }

  function handleSubmit(e) {
    e.preventDefault();

    if (formInfo.body.trim() === "") {
      setError(true);
      return;
    }

    setLoading(true);
    postComment(article_id, formInfo)
      .then((newComment) => {
        setComments((prevComments) => [...prevComments, newComment]);
        // Reset form
        setFormInfo({
          username: username,
          body: "",
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
      username: username,
      body: "",
    });
    setError(false);
  }

  if (loading) {
    return <p>Loading new comment form...</p>;
  }

  return (
    <>
      <div className="new-comment-form">
        <h3>New Comment:</h3>
        <form>
          <label htmlFor="body"></label>
          <input
            type="text"
            id="body"
            value={formInfo.body}
            placeholder="Write your comment here..."
            className="comment-form-input"
            onChange={handleChange}
            required
          />
          {error && <p className="err-message">Please enter a valid comment</p>}

          <div className="comment-form-btns">
            <button className="comment-form-btn" onClick={handleSubmit}>
              Post
            </button>
            <button className="cancel-comment-btn" onClick={handleDiscard}>
              Discard
            </button>
          </div>
          {successful && (
            <strong>
              <p className="success-message">Comment posted successfully!</p>
            </strong>
          )}
        </form>
      </div>
    </>
  );
}

export default NewCommentForm;
