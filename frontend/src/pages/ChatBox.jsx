// import "../styles/ChatBox.css";
// import { useEffect, useState, useRef } from "react";
// import api from "../utils/axios";
// import { socket } from "../socket";
// import MessageBubble from "./MessageBubble";
// import SendIcon from "@mui/icons-material/Send";

// export default function ChatBox({ currentChat, user }) {
//   const [messages, setMessages] = useState([]);
//   const [text, setText] = useState("");
//   const scrollRef = useRef();

//   // 🔥 get receiver
//   const receiverId =
//     currentChat?.members?.find(
//       (m) => m?._id && m._id.toString() !== user._id.toString()
//     )?._id;

//   // 🔥 get other user (for header)
//   const otherUser = currentChat?.members?.find(
//     (m) => m?._id && m._id.toString() !== user._id.toString()
//   );

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
//       if (
//         msg.conversationId.toString() ===
//         currentChat?._id.toString()
//       ) {
//         setMessages((prev) => [...prev, msg]);
//       }
//     };

//     socket.on("receiveMessage", handleReceive);

//     return () => {
//       socket.off("receiveMessage", handleReceive);
//     };
//   }, [currentChat]);

//   // ================= AUTO SCROLL =================
//   useEffect(() => {
//     scrollRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [messages]);

//   // ================= SEND MESSAGE =================
//   const sendMessage = () => {
//     if (!text.trim() || !receiverId) return;

//     const newMsg = {
//       _id: Date.now(),
//       sender: user._id,
//       text,
//       conversationId: currentChat._id,
//     };

//     // 🔥 optimistic UI
//     setMessages((prev) => [...prev, newMsg]);

//     socket.emit("sendMessage", {
//       senderId: user._id,
//       receiverId,
//       text,
//     });

//     setText("");
//   };

//   // 🔥 Enter to send
//   const handleKeyDown = (e) => {
//     if (e.key === "Enter") {
//       sendMessage();
//     }
//   };

//   // ================= EMPTY STATE =================
//   if (!currentChat || !currentChat.members) {
//     return <h2>Select a chat</h2>;
//   }

//   // ================= UI =================
//   return (
//     <div className="chatbox">

//       {/* 🔥 HEADER */}
//       <div className="chat-header">
//         <div className="chat-user">
//           <div className="chat-avatar">
//             {otherUser?.name?.charAt(0).toUpperCase() || "U"}
//           </div>

//           <div className="chat-user-info">
//             <h3>{otherUser?.name || "User"}</h3>
//             <span>Active now</span>
//           </div>
//         </div>
//       </div>

//       {/* 🔥 MESSAGES */}
//       <div className="chat-messages">
//         {messages.map((m, i) => (
//           <div
//             key={m._id || i}
//             ref={i === messages.length - 1 ? scrollRef : null}
//           >
//             <MessageBubble
//               message={m}
//               own={m.sender.toString() === user._id.toString()}
//             />
//           </div>
//         ))}
//       </div>

//       {/* 🔥 INPUT */}
//       <div className="chat-input-area">
//         <input
//           value={text}
//           onChange={(e) => setText(e.target.value)}
//           placeholder="Type a message..."
//           onKeyDown={handleKeyDown}
//         />

//         <button className="send-btn" onClick={sendMessage}>
//           <SendIcon />
//         </button>
//       </div>
//     </div>
//   );
// }

import "../styles/ChatBox.css";
import { useEffect, useState, useRef } from "react";
import api from "../utils/axios";
import { socket } from "../socket";
import MessageBubble from "./MessageBubble";
import SendIcon from "@mui/icons-material/Send";

export default function ChatBox({ currentChat, user,setIsMobileChatOpen}) {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const scrollRef = useRef();

  // 🔥 get receiver
  const receiverId =
    currentChat?.members?.find(
      (m) => m?._id && m._id.toString() !== user._id.toString()
    )?._id;

  // 🔥 get other user (for header)
  const otherUser = currentChat?.members?.find(
    (m) => m?._id && m._id.toString() !== user._id.toString()
  );

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

  // ================= AUTO SCROLL =================
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

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

  // 🔥 Enter to send
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  };

  // ================= EMPTY STATE =================
  if (!currentChat || !currentChat.members) {
    return <h2>Select a chat</h2>;
  }

  // ================= UI =================
  return (
    <div className="chatbox">

      {/* 🔥 HEADER */}
      <div className="chat-header">
         <button 
  className="back-btn"
  onClick={() => setIsMobileChatOpen(false)}
>
  ←
</button>
        <div className="chat-user">
          <div className="chat-avatar">
            {otherUser?.name?.charAt(0).toUpperCase() || "U"}
          </div>

          <div className="chat-user-info">
            <h3>{otherUser?.name || "User"}</h3>
            <span>Active now</span>
          </div>
        </div>
      </div>

      {/* 🔥 MESSAGES */}
      <div className="chat-messages">
        {messages.map((m, i) => (
          <div
            key={m._id || i}
            ref={i === messages.length - 1 ? scrollRef : null}
          >
            <MessageBubble
              message={m}
              own={m.sender.toString() === user._id.toString()}
            />
          </div>
        ))}
      </div>

      {/* 🔥 INPUT */}
      <div className="chat-input-area">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type a message..."
          onKeyDown={handleKeyDown}
        />

        <button className="send-btn" onClick={sendMessage}>
          <SendIcon />
        </button>
      </div>
    </div>
  );
}