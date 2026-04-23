import { useNavigate } from "react-router-dom";
import "../styles/ChatSidebar.css";

export default function ChatSidebar({
  conversations,
  setCurrentChat,
  user,
  currentChat,
  isMobileChatOpen
}) {
  const navigate = useNavigate();

  return (
    <div className={`chat-sidebar ${isMobileChatOpen ? "hide" : ""}`}>
      
      {/* HEADER */}
      <div className="sidebar-header">
        <h2>Messages</h2>
      </div>

      {/* SEARCH */}
      <input
        type="text"
        placeholder="Search conversations..."
        className="search-box"
      />

      {/* LIST */}
      <div className="chat-list">
        {conversations?.map((c) => {
          
          // 🔥 FULL SAFETY
          if (!c || !c.members) return null;

          const otherUser = c.members.find(
            (m) =>
              m &&
              m._id &&
              user &&
              m._id.toString() !== user._id?.toString()
          );

          return (
            <div
              key={c._id}
              className={`chat-item ${
                currentChat?._id === c._id ? "active" : ""
              }`}
              onClick={() => {
                if (!otherUser?._id) return;

                setCurrentChat(c);
                navigate(`/chatpage/${otherUser._id}`, { replace: true });
              }}
            >
              {/* AVATAR */}
              <div className="avatar">
                {otherUser?.name?.charAt(0)?.toUpperCase() || "U"}
              </div>

              {/* INFO */}
              <div className="chat-info">
                <h4>{otherUser?.name || "User"}</h4>
                <p>{c.lastMessage || "No messages yet"}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}