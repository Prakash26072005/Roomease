// export default function ChatSidebar({ conversations, setCurrentChat, user }) {
//   return (
//     <div style={{ width: "30%", borderRight: "1px solid #ccc" }}>
//       {conversations.map((c) => {
//         const otherUser = c.members.find(
//           (m) => m._id !== user._id
//         );

//         return (
//           <div key={c._id} onClick={() => setCurrentChat(c)}>
//             <h4>{otherUser.name}</h4>
//             <p>{c.lastMessage}</p>
//           </div>
//         );
//       })}
//     </div>
//   );
// }
import { useNavigate } from "react-router-dom";

export default function ChatSidebar({ conversations, setCurrentChat, user }) {
  const navigate = useNavigate();

  return (
    <div style={{ width: "30%", borderRight: "1px solid #ccc" }}>
      {conversations.map((c) => {
        const otherUser = c.members.find(
          (m) => m._id.toString() !== user._id.toString()
        );

        return (
          <div
            key={c._id}
            onClick={() =>
              otherUser && navigate(`/chatpage/${otherUser._id}`)
            }
            style={{ cursor: "pointer", padding: "10px" }}
          >
            <h4>{otherUser?.name || "Unknown User"}</h4>
            <p>{c.lastMessage || "No messages yet"}</p>
          </div>
        );
      })}
    </div>
  );
}