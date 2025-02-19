import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import "../App.css";

function ArticlesHeader({
  topics,
  sortBy,
  setSortBy,
  order,
  setOrder,
  topic,
  setTopic,
}) {
  const navigate = useNavigate();

  const handleSortByChange = (e) => {
    setSortBy(e.target.value);
  };

  const handleOrderChange = (e) => {
    setOrder(e.target.value);
  };

  const handleTopicChange = (e) => {
    setTopic(e.target.value);
  };

  return (
    <>
      <header className="articles-header-bar">
        <h2>Articles {topic && `on ${topic}`}</h2>
        <div className="articles-header-btns">
          <div className="sort-filter-btns">
            {/* Sort By Dropdown */}
            <select
              className="dropdown"
              onChange={handleSortByChange}
              value={""}
            >
              <option value="" disabled>
                Sort by
              </option>
              <option value="created_at">Date</option>
              <option value="title">Title</option>
              <option value="votes">Votes</option>
            </select>

            {/* Order Dropdown */}
            <select
              className="dropdown"
              onChange={handleOrderChange}
              value={""}
            >
              <option value="" disabled>
                Order
              </option>
              <option value="asc">Ascending</option>
              <option value="desc">Descending</option>
            </select>

            {/* Topic Dropdown */}
            <select
              className="dropdown"
              onChange={handleTopicChange}
              value={""}
            >
              <option value="" disabled>
                Filter by topic
              </option>
              <option value="">All Topics</option>
              {topics.map((topic) => (
                <option key={topic.slug} value={topic.slug}>
                  {topic.slug}
                </option>
              ))}
            </select>
          </div>
          <button
            className="new-article-btn"
            onClick={() => {
              navigate("/articles/new");
            }}
          >
            New article!
          </button>
        </div>
      </header>
    </>
  );
}

export default ArticlesHeader;
