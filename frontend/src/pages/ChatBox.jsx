
// import { useEffect, useState } from "react";
// import api from "../utils/axios";
// import { socket } from "../socket";
// import MessageBubble from "./MessageBubble";

// export default function ChatBox({ currentChat, user }) {
//   const [messages, setMessages] = useState([]);
//   const [text, setText] = useState("");

//   const receiverId =
//     currentChat?.members?.find(
//       (m) => m?._id && m._id.toString() !== user._id.toString()
//     )?._id;

//   // ================= LOAD MESSAGES =================
//   useEffect(() => {
//     if (!currentChat?._id) return;

//     api.get(`/api/messages/${currentChat._id}`).then((res) => {
//       setMessages(res.data.messages);
//     });
//   }, [currentChat]);

//   // ================= SOCKET LISTEN =================
//   useEffect(() => {
//     const handleReceive = (msg) => {
//       setMessages((prev) => [...prev, msg]);
//     };

//     socket.on("receiveMessage", handleReceive);
//     socket.on("messageSent", handleReceive);

//     return () => {
//       socket.off("receiveMessage", handleReceive);
//       socket.off("messageSent", handleReceive);
//     };
//   }, []);

//   // ================= SEND MESSAGE =================
//   const sendMessage = () => {
//     if (!text.trim() || !receiverId) return;

//     socket.emit("sendMessage", {
//       senderId: user._id,
//       receiverId,
//       text,
//     });

//     setText("");
//   };

//   // ================= EMPTY STATE =================
//   if (!currentChat || !currentChat.members) {
//     return <h2>Select a chat</h2>;
//   }

//   // ================= UI =================
//   return (
//     <div style={{ flex: 1, padding: "10px" }}>
//       <div style={{ minHeight: "80%" }}>
//         {messages.map((m, i) => (
//           <div key={i}>
//             <MessageBubble
//               message={m}
//               own={m.sender.toString() === user._id.toString()}
//             />
//           </div>
//         ))}
//       </div>

//       <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
//         <input
//           value={text}
//           onChange={(e) => setText(e.target.value)}
//           placeholder="Type a message..."
//           style={{ flex: 1 }}
//         />
//         <button onClick={sendMessage}>Send</button>
//       </div>
//     </div>
//   );
// }

import { useEffect, useState } from "react";
import api from "../utils/axios";
import { socket } from "../socket";
import MessageBubble from "./MessageBubble";

export default function ChatBox({ currentChat, user }) {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");

  const receiverId =
    currentChat?.members?.find(
      (m) => m?._id && m._id.toString() !== user._id.toString()
    )?._id;

  // ================= LOAD MESSAGES =================
  useEffect(() => {
    if (!currentChat?._id) return;

    api.get(`/api/messages/${currentChat._id}`).then((res) => {
      setMessages(res.data.messages);
    });
  }, [currentChat]);

  // ================= SOCKET LISTEN =================
  useEffect(() => {
    const handleReceive = (msg) => {
      if (
        msg.conversationId.toString() ===
        currentChat?._id.toString()
      ) {
        setMessages((prev) => [...prev, msg]);
      }
    };

    socket.on("receiveMessage", handleReceive);

    return () => {
      socket.off("receiveMessage", handleReceive);
    };
  }, [currentChat]);

  // ================= SEND MESSAGE =================
  const sendMessage = () => {
    if (!text.trim() || !receiverId) return;

    const newMsg = {
      _id: Date.now(),
      sender: user._id,
      text,
      conversationId: currentChat._id,
    };

    // 🔥 optimistic UI
    setMessages((prev) => [...prev, newMsg]);

    socket.emit("sendMessage", {
      senderId: user._id,
      receiverId,
      text,
    });

    setText("");
  };

  // ================= EMPTY STATE =================
  if (!currentChat || !currentChat.members) {
    return <h2>Select a chat</h2>;
  }

  // ================= UI =================
  return (
    <div style={{ flex: 1, padding: "10px" }}>
      <div style={{ minHeight: "80%" }}>
        {messages.map((m, i) => (
          <div key={m._id || i}>
            <MessageBubble
              message={m}
              own={m.sender.toString() === user._id.toString()}
            />
          </div>
        ))}
      </div>

      <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type a message..."
          style={{ flex: 1 }}
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
}