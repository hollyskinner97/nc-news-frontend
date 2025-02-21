import { useContext, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import NewCommentForm from "./NewCommentForm";
import LoadingPage from "./LoadingPage";
import ErrorHandler from "./ErrorHandler";
import {
  deleteComment,
  getCommentsByArticleId,
  patchVotesOnComment,
} from "../api";
import { UserAccount } from "../contexts/UserAccount";
import dayjs from "dayjs";
import "../App.css";
import CommentCard from "./CommentCard";

function CommentsList() {
  const { username } = useContext(UserAccount);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [votes, setVotes] = useState(0);
  const [userVotes, setUserVotes] = useState({});
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

  function handleVote(comment_id, inc) {
    const currVote = userVotes[comment_id] || 0;
    const newVote = currVote === inc ? 0 : inc;

    // Optimistic rendering of the vote
    setUserVotes((prevVotes) => ({
      ...prevVotes,
      [comment_id]: newVote,
    }));

    // Optimistically update the votes for the specific comment
    setComments((prevComments) =>
      prevComments.map((comment) =>
        comment.comment_id === comment_id
          ? {
              ...comment,
              votes: comment.votes + (newVote - currVote),
            }
          : comment
      )
    );

    patchVotesOnComment(comment_id, { inc_votes: newVote })
      .then(() => {})
      .catch((err) => {
        // If request fails, revert the optimistic update
        setUserVotes((prevVotes) => ({
          ...prevVotes,
          [comment_id]: 0,
        }));

        setComments((prevComments) =>
          prevComments.map((comment) =>
            comment.comment_id === comment_id
              ? { ...comment, votes: comment.votes - (newVote - currVote) }
              : comment
          )
        );
        alert(
          "Something went wrong while updating your vote. Please try again."
        );
      });
  }

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
            return (
              <CommentCard
                key={comment.comment_id}
                comment={comment}
                userVotes={userVotes}
                handleVote={handleVote}
                handleDelete={handleDelete}
                username={username}
              />
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
