export default function MessageBubble({ message, own }) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: own ? "flex-end" : "flex-start",
        marginBottom: "10px",
      }}
    >
      <div
        style={{
          background: own ? "#007bff" : "#eee",
          color: own ? "#fff" : "#000",
          padding: "10px",
          borderRadius: "10px",
          maxWidth: "70%",

          // 🔥 MAIN FIX
          wordBreak: "break-word",
          overflowWrap: "break-word",
          whiteSpace: "pre-wrap",
        }}
      >
        {message.text}
      </div>
    </div>
  );
}