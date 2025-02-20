import { useContext, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import NewCommentForm from "./NewCommentForm";
import LoadingPage from "./LoadingPage";
import ErrorHandler from "./ErrorHandler";
import { deleteComment, getCommentsByArticleId } from "../api";
import { UserAccount } from "../contexts/UserAccount";
import dayjs from "dayjs";
import "../App.css";

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
        setError(err);
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
        setError(err);
        // Restore the comment if delete fails
        setComments((prevComments) => [...prevComments, commentToDelete]);
      });
  }

  if (loading) {
    return <LoadingPage message={"Loading comments..."} />;
  }

  if (error) {
    return <ErrorHandler message={error.message} />;
  }

  return (
    <div className="comment-section">
      <h2>Comments...</h2>
      <NewCommentForm setComments={setComments} />

      {comments.length > 0 ? (
        <>
          {comments.map((comment) => {
            const formattedDate = dayjs(comment.created_at).format(
              "MMM D, YYYY"
            );

            return (
              <section className="comment-card" key={comment.comment_id}>
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
              </section>
            );
          })}
          <button
            className="load-more-btn"
            onClick={() => setPage((prev) => prev + 1)}
            disabled={loading}
          >
            Load more comments...
          </button>
        </>
      ) : (
        <p className="no-comments-msg">
          Sorry, there are no comments available here! Fill out the form above
          to write the first one...
        </p>
      )}
    </div>
  );
}

export default CommentsList;
