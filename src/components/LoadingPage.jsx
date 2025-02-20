import "../App.css";

function LoadingPage({ message }) {
  return (
    <div className="loading-page">
      <h2 className="loading-message">{message}</h2>
      <p>Please bear with us!</p>
    </div>
  );
}

export default LoadingPage;
