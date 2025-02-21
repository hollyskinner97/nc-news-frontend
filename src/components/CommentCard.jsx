import React from "react";

function CommentCard({
  comment,
  userVotes,
  handleVote,
  handleDelete,
  username,
}) {
  const { comment_id, author, body, votes, created_at } = comment;

  return (
    <section className="comment-card" key={comment_id}>
      <div className="content">
        <p>{new Date(created_at).toLocaleDateString()}</p>
        <p>
          <strong>{author}</strong>: {body}
        </p>
        <p>Votes: {votes}</p>
      </div>
      <div className="comment-card-btns">
        <div className="comment-vote-btns">
          <button
            className={`comment-vote-btn ${
              userVotes[comment_id] === 1 ? "voted" : ""
            }`}
            onClick={() => handleVote(comment_id, 1)}
          >
            {userVotes[comment_id] === 1 ? "Remove vote" : "Up vote!"}
          </button>
          <button
            className={`comment-vote-btn ${
              userVotes[comment_id] === -1 ? "voted" : ""
            }`}
            onClick={() => handleVote(comment_id, -1)}
          >
            {userVotes[comment_id] === -1 ? "Remove vote" : "Down vote!"}
          </button>
        </div>
        {author === username && (
          <button
            className="delete-btn"
            onClick={() => handleDelete(comment_id)}
          >
            Delete
          </button>
        )}
      </div>
    </section>
  );
}

export default CommentCard;
