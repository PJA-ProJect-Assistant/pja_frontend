import "./MainHeader.css";

export function PostHeader() {
  return (
    <>
      <div className="mainwsheader-container">
        <div onClick={() => window.history.back()} className="div-left">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="24px"
            viewBox="0 -960 960 960"
            width="24px"
            fill="#000000"
          >
            <path d="M400-80 0-480l400-400 71 71-329 329 329 329-71 71Z" />
          </svg>
        </div>
        <h1></h1>
        <div className="div-right"></div>
      </div>
    </>
  );
}
