import "./LoadingSpinner.css";

const LoadingSpinner = () => {
  return (
    <div className="loading-container">
      <div className="spinner" />
      <p>로딩 중입니다...</p>
    </div>
  );
};

export default LoadingSpinner;
