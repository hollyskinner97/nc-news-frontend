import { useContext, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import "../App.css";
import dayjs from "dayjs";
import { getCommentsByArticleId } from "../api";
import NewCommentForm from "./NewCommentForm";
import { CommentsContext } from "../contexts/Comments";

function CommentsList() {
  const { comments, setComments } = useContext(CommentsContext);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const { article_id } = useParams();

  useEffect(() => {
    getCommentsByArticleId(article_id).then((comments) => {
      setComments(comments);
    });
  }, []);

  function handleDelete() {}

  if (!comments) {
    return <p>Loading...</p>;
  }

  return (
    <div className="comment-section">
      <h2>Comments...</h2>
      <NewCommentForm />

      {comments.map((comment) => {
        const formattedDate = dayjs(comment.created_at).format("MMM D, YYYY");

        return (
          <div className="comment-card" key={comment.comment_id}>
            <div className="content">
              <h3>{comment.author}</h3>
              <p>{comment.body}</p>
              <p>Votes: {comment.votes}</p>
              <p>{formattedDate}</p>
            </div>
            <div className="buttons">
              <button>Like</button>
              <button onClick={handleDelete}>Delete</button>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default CommentsList;
