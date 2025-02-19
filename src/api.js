import axios from "axios";

const api = axios.create({
  baseURL: "https://hs-news.onrender.com/api", // Maybe hide this later?
});

export const getArticles = ({ limit = 10, p = 1 } = {}) => {
  return api.get("/articles", { params: { limit, p } }).then((res) => {
    return res.data;
  });
};

export const getArticlesById = (article_id) => {
  return api.get(`/articles/${article_id}`).then((res) => {
    return res.data.article;
  });
};

export const patchVotesOnArticle = (article_id, voteData) => {
  return api
    .patch(`/articles/${article_id}`, voteData)
    .then((res) => {
      return res.data;
    })
    .catch((error) => {
      throw error;
    });
};

export const getCommentsByArticleId = (
  article_id,
  { limit = 3, p = 1 } = {}
) => {
  return api
    .get(`/articles/${article_id}/comments`, { params: { limit, p } })
    .then((res) => {
      return res.data.comments;
    })
    .catch((error) => {
      throw error;
    });
};

export const postComment = (article_id, newComment) => {
  console.log(
    "Posting comment with article_id:",
    article_id,
    "and comment:",
    newComment
  );
  return api
    .post(`/articles/${article_id}/comments`, newComment)
    .then((res) => {
      return res.data.comment;
    });
};

export const deleteComment = (comment_id) => {
  return api
    .delete(`/comments/${comment_id}`)
    .then(() => {})
    .catch((error) => {
      throw error;
    });
};
