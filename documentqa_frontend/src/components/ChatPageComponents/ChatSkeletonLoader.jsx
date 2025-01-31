const ChatSkeletonLoader = () => (
  <div className="d-flex align-items-center gap-3 mb-3">
    <div
      className="spinner-grow text-dark"
      role="status"
      style={{ width: "1.5rem", height: "1.5rem" }}
    >
      <span className="visually-hidden">Loading...</span>
    </div>
    <div
      className="bg-light text-muted py-2 px-4 rounded"
      style={{ maxWidth: "75%" }}
    >
      <div
        className="placeholder placeholder-wave mb-2"
        style={{
          width: "70%",
          height: "15px",
          backgroundColor: "#e0e0e0",
          borderRadius: "4px",
        }}
      ></div>
      <div
        className="placeholder placeholder-wave"
        style={{
          width: "50%",
          height: "15px",
          backgroundColor: "#e0e0e0",
          borderRadius: "4px",
        }}
      ></div>
    </div>
  </div>
);

export default ChatSkeletonLoader;
