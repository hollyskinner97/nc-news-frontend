import { useContext, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import "../App.css";
import { postComment } from "../api";
import { UserAccount } from "../contexts/UserAccount";
import { CommentsContext } from "../contexts/Comments";

function NewCommentForm() {
  const { username } = useContext(UserAccount);
  const { setComments } = useContext(CommentsContext);
  const { article_id } = useParams();
  const [error, setError] = useState(false);
  const [successful, setSuccessful] = useState(false);
  const [formInfo, setFormInfo] = useState({
    username: username,
    body: "",
  });

  function handleChange(e) {
    const { value } = e.target;
    console.log(e.target);

    setSuccessful(false);
    setFormInfo((curr) => ({
      ...curr,
      body: value,
    }));
    setError(false);
  }

  function handleSubmit(e) {
    e.preventDefault();
    console.log(formInfo);

    if (formInfo.body.trim() === "") {
      setError(true);
      return;
    }

    postComment(article_id, formInfo)
      .then((newComment) => {
        console.log("Comment posted: ", newComment);
        setComments((prevComments) => [...prevComments, newComment]);
        // Reset form
        setFormInfo({
          username: username,
          body: "",
        });
        setSuccessful(true);
      })
      .catch((err) => console.log("Error posting comment: ", err));
  }

  function handleDiscard(e) {
    e.preventDefault();
    setFormInfo({
      username: username,
      body: "",
    });
    setError(false);
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
          {error && (
            <p className="empty-comment-err">Please enter a valid comment</p>
          )}

          <div className="comment-form-btns">
            <button className="comment-form-btn" onClick={handleSubmit}>
              Post
            </button>
            <button className="cancel-comment-btn" onClick={handleDiscard}>
              Discard
            </button>
          </div>
          {successful && (
            <p className="success-message">Comment posted successfully!</p>
          )}
        </form>
      </div>
    </>
  );
}

export default NewCommentForm;
