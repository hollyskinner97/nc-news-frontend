import axios from "axios";

const api = axios.create({
  baseURL: "https://hs-news.onrender.com/api", // Maybe hide this later?
});

export const getArticles = ({
  limit = 10,
  p = 1,
  topic,
  sort_by,
  order,
} = {}) => {
  const params = { limit, p };

  if (topic) params.topic = topic;
  if (sort_by) params.sort_by = sort_by;
  if (order) params.order = order;

  return api.get("/articles", { params }).then((res) => {
    return res.data;
  });
};

export const getArticlesById = (article_id) => {
  return api.get(`/articles/${article_id}`).then((res) => {
    return res.data.article;
  });
};

export const postArticle = (newArticle) => {
  return api.post(`/articles`, newArticle).then((res) => {
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

export const deleteArticle = (article_id) => {
  return api.delete(`/articles/${article_id}`).catch((error) => {
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
  return api
    .post(`/articles/${article_id}/comments`, newComment)
    .then((res) => {
      return res.data.comment;
    });
};

export const deleteComment = (comment_id) => {
  return api.delete(`/comments/${comment_id}`).catch((error) => {
    throw error;
  });
};

export const getTopics = () => {
  return api.get("/topics").then((res) => {
    return res.data.topics;
  });
};

export const postTopic = (newTopic) => {
  return api.post(`/topics`, newTopic).then((res) => {
    return res.data.topic;
  });
};

export const getUsers = () => {
  return api.get("/users").then((res) => {
    return res.data.users;
  });
};

export const getUserByUsername = (username) => {
  return api.get(`/users/${username}`).then((res) => {
    return res.data.user;
  });
};
