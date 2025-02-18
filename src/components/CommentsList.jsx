import { useContext, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import "../App.css";
import dayjs from "dayjs";
import { deleteComment, getCommentsByArticleId } from "../api";
import NewCommentForm from "./NewCommentForm";
import { UserAccount } from "../contexts/UserAccount";

function CommentsList() {
  const { username } = useContext(UserAccount);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [page, setPage] = useState(1);
  const { article_id } = useParams();

  useEffect(() => {
    setLoading(true);
    setError(null);

    getCommentsByArticleId(article_id, { p: page })
      .then((comments) => {
        setComments((prev) => [...prev, ...comments]);
      })
      .catch((err) => {
        console.error("Error fetching comments:", err);
        setError("Failed to load comments");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [article_id, page]);

  function handleDelete(comment_id) {
    if (deleting) return;
    setDeleting(true);
    setError(null);

    const commentToDelete = comments.find(
      (comment) => comment.comment_id === comment_id
    );

    setComments((prevComments) =>
      prevComments.filter((comment) => comment.comment_id !== comment_id)
    );

    deleteComment(comment_id)
      .then(() => {
        alert("Comment successfully deleted");
      })
      .catch((err) => {
        setError("Failed to delete comment. Please try again.");
        // Restore the comment if delete fails
        setComments((prevComments) => [...prevComments, commentToDelete]);
      });
  }

  if (loading) {
    return <p>Loading comments...</p>;
  }

  return (
    <div className="comment-section">
      <h2>Comments...</h2>
      <NewCommentForm setComments={setComments} />
      {error && <p className="err-message">{error}</p>}

      {comments.map((comment) => {
        const formattedDate = dayjs(comment.created_at).format("MMM D, YYYY");

        return (
          <div className="comment-card" key={comment.comment_id}>
            <div className="content">
              <p>{formattedDate}</p>
              <p>
                <strong>{comment.author}</strong>: {comment.body}
              </p>
              <p>Votes: {comment.votes}</p>
            </div>
            <div className="buttons">
              <button>Up vote!</button>
              <button>Down vote!</button>
              {comment.author === username && (
                <button onClick={() => handleDelete(comment.comment_id)}>
                  Delete
                </button>
              )}
            </div>
          </div>
        );
      })}
      <button
        className="load-more-btn"
        onClick={() => setPage((prev) => prev + 1)}
        disabled={loading}
      >
        Load more comments...
      </button>
    </div>
  );
}

export default CommentsList;
