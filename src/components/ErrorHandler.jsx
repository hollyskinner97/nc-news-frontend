import "../App.css";

function ErrorHandler({ message }) {
  return (
    <div className="err-handler">
      <h2>Error</h2>
      <p className="err-message">{message}</p>
    </div>
  );
}

export default ErrorHandler;
