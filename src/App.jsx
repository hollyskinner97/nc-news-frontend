import { Routes, Route } from "react-router-dom";
import "./App.css";
import { UserAccountProvider } from "./contexts/UserAccount";
import Header from "./components/Header";
import HomePage from "./components/HomePage";
import ArticlePage from "./components/ArticlePage";
import NewArticlePage from "./components/NewArticlePage";
import UsersPage from "./components/UsersPage";
import AccountPage from "./components/AccountPage";
import TopicsPage from "./components/TopicsPage";
import ErrorHandler from "./components/ErrorHandler";

function App() {
  return (
    <div className="app-container">
      <UserAccountProvider>
        <Header className="header"></Header>

        <Routes>
          <Route path="/" element={<HomePage />}></Route>
          <Route path="/articles" element={<HomePage />} />
          <Route path="/articles/:article_id" element={<ArticlePage />}></Route>
          <Route path="/articles/new" element={<NewArticlePage />}></Route>
          <Route path="/users" element={<UsersPage />}></Route>
          <Route path="/users/:username" element={<AccountPage />}></Route>
          <Route path="/topics" element={<TopicsPage />}></Route>
          <Route
            path="*"
            element={<ErrorHandler message={"Invalid route!"} />}
          />
        </Routes>
      </UserAccountProvider>
      <footer>Copyright</footer>
    </div>
  );
}

export default App;
