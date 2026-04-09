// import { useNavigate } from "react-router-dom";

// export default function ChatSidebar({ conversations, setCurrentChat, user }) {
//   const navigate = useNavigate();

//   return (
//     <div style={{ width: "30%", borderRight: "1px solid #ccc" }}>
//       {conversations.map((c) => {
//         const otherUser = c.members.find(
//           (m) => m._id.toString() !== user._id.toString()
//         );

//         return (
//           <div
//             key={c._id}
//             onClick={() =>
//               otherUser && navigate(`/chatpage/${otherUser._id}`)
//             }
//             style={{ cursor: "pointer", padding: "10px" }}
//           >
//             <h4>{otherUser?.name || "Unknown User"}</h4>
//             <p>{c.lastMessage || "No messages yet"}</p>
//           </div>
//         );
//       })}
//     </div>
//   );
// }


// import { useNavigate } from "react-router-dom";
// import "../styles/ChatSidebar.css";

// export default function ChatSidebar({ conversations, setCurrentChat, user, currentChat}) {
//   const navigate = useNavigate();

//   return (
//     <div className="chat-sidebar">
      
//       {/* HEADER */}
//       <div className="sidebar-header">
//         <h2>Messages</h2>
//       </div>

//       {/* SEARCH */}
//       <input
//         type="text"
//         placeholder="Search conversations..."
//         className="search-box"
//       />

//       {/* LIST */}
//       <div className="chat-list">
//         {conversations.map((c) => {
//           const otherUser = c.members.find(
//             (m) => m._id.toString() !== user._id.toString()
//           );

//           return (
//             // <div
//             //   key={c._id}
//             //   className="chat-item"
//             //   onClick={() => {
//             //     setCurrentChat(c);
//             //     navigate(`/chatpage/${otherUser._id}`);
//             //   }}
//             // >
//             <div
//   key={c._id}
//   className={`chat-item ${
//     currentChat?._id === c._id ? "active" : ""
//   }`}
//   onClick={() => {
//     setCurrentChat(c);
//     navigate(`/chatpage/${otherUser._id}`);
//   }}
// >
//               {/* AVATAR */}
//               <div className="avatar">
//                 {otherUser?.name?.charAt(0).toUpperCase()}
//               </div>

//               {/* INFO */}
//               <div className="chat-info">
//                 <h4>{otherUser?.name || "Unknown User"}</h4>
//                 <p>{c.lastMessage || "No messages yet"}</p>
//               </div>
//             </div>
//           );
//         })}
//       </div>
//     </div>
//   );
// }

import { useNavigate } from "react-router-dom";
import "../styles/ChatSidebar.css";

export default function ChatSidebar({
  conversations,
  setCurrentChat,
  user,
  currentChat,
}) {
  const navigate = useNavigate();

  return (
    <div className="chat-sidebar">
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
        {conversations.map((c) => {
          // 🔥 SAFE otherUser FIND
          const otherUser = c.members?.find(
            (m) => m?._id && m._id.toString() !== user?._id?.toString()
          );

          return (
            <div
              key={c._id}
              className={`chat-item ${
                currentChat?._id === c._id ? "active" : ""
              }`}
              onClick={() => {
                if (!otherUser?._id) return; // 🔥 prevent crash

                setCurrentChat(c);
                navigate(`/chatpage/${otherUser._id}`);
              }}
            >
              {/* AVATAR */}
              <div className="avatar">
                {otherUser?.name?.charAt(0).toUpperCase() || "U"}
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