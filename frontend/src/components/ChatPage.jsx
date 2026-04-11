
// import React, { useEffect, useState, useCallback } from "react";
// import ChatSidebar from "../pages/ChatSidebar";
// import ChatBox from "../pages/ChatBox";
// import { socket } from "../socket";
// import api from "../utils/axios";
// import { useParams } from "react-router-dom";
// import "../styles/Chat.css";

// export default function ChatPage() {
//   const [conversations, setConversations] = useState([]);
//   const [currentChat, setCurrentChat] = useState(null);

//   const user = JSON.parse(localStorage.getItem("user"));
//   const { userId } = useParams();

//   const isValidObjectId = (id) =>
//     /^[0-9a-fA-F]{24}$/.test(id);

//   // ================= LOAD CONVERSATIONS =================
//   const fetchConversations = useCallback(async () => {
//     try {
//       const res = await api.get("/api/messages/conversations/my");
//       setConversations(res.data.conversations);
//     } catch (err) {
//       console.error(err);
//     }
//   }, []);

//   useEffect(() => {
//     fetchConversations();
//   }, [fetchConversations]);

//   // ================= SOCKET JOIN =================
//   useEffect(() => {
//     if (!user?._id) return;
//     socket.emit("join", user._id);
//   }, [user]);

//   // ================= OPEN CHAT FROM URL =================
//   useEffect(() => {
//     if (!userId || !isValidObjectId(userId)) return;

//     const openChat = async () => {
//       try {
//         const res = await api.post("/api/messages/conversation", {
//           receiverId: userId,
//         });

//         const newChat = res.data.conversation;

//         // 🔥 avoid duplicate in state
//         setConversations((prev) => {
//           const exists = prev.find(
//             (c) => String(c._id) === String(newChat._id)
//           );
//           if (exists) return prev;
//           return [newChat, ...prev];
//         });

//         setCurrentChat(newChat);
//       } catch (err) {
//         console.error(err);
//       }
//     };

//     openChat();
//   }, [userId]);

//   // ================= SOCKET UPDATE =================
//   useEffect(() => {
//     const handleNewMessage = (msg) => {
//       setConversations((prev) => {
//         const updated = [...prev];

//         const index = updated.findIndex(
//           (c) => String(c._id) === String(msg.conversationId)
//         );

//         if (index !== -1) {
//           updated[index].lastMessage = msg.text;

//           const [chat] = updated.splice(index, 1);
//           updated.unshift(chat);
//         }

//         return updated;
//       });
//     };

//     socket.on("receiveMessage", handleNewMessage);
//     socket.on("messageSent", handleNewMessage);

//     return () => {
//       socket.off("receiveMessage", handleNewMessage);
//       socket.off("messageSent", handleNewMessage);
//     };
//   }, []);

//   // ================= DEFAULT SELECT =================
//   useEffect(() => {
//     if (!userId && conversations.length > 0) {
//       setCurrentChat(conversations[0]);
//     }
//   }, [conversations, userId]);

//   // ================= UI =================
//   return (
//     <div className="chat-page">
//       <ChatSidebar
//         conversations={conversations}
//         setCurrentChat={setCurrentChat}
//         user={user}
//         currentChat={currentChat}
//       />
//       <ChatBox currentChat={currentChat} user={user} />
//     </div>
//   );
// }


import React, { useEffect, useState, useCallback } from "react";
import ChatSidebar from "../pages/ChatSidebar";
import ChatBox from "../pages/ChatBox";
import { socket } from "../socket";
import api from "../utils/axios";
import { useParams } from "react-router-dom";
import "../styles/Chat.css";

export default function ChatPage() {
  const [conversations, setConversations] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);

  const user = JSON.parse(localStorage.getItem("user"));
  const { userId } = useParams();

  const isValidObjectId = (id) =>
    /^[0-9a-fA-F]{24}$/.test(id);

  // ================= LOAD CONVERSATIONS =================
  const fetchConversations = useCallback(async () => {
    try {
      const res = await api.get("/api/messages/conversations/my");
      setConversations(res.data.conversations);
    } catch (err) {
      console.error(err);
    }
  }, []);

  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  // ================= SOCKET JOIN =================
  useEffect(() => {
    if (!user?._id) return;
    socket.emit("join", user._id);
  }, [user]);

  // ================= OPEN CHAT FROM URL =================
 const hasOpened = React.useRef(false);

  useEffect(() => {
    if (!userId || !isValidObjectId(userId)) return;
  if (hasOpened.current) return;

  hasOpened.current = true;

    const openChat = async () => {
      try {
        const res = await api.post("/api/messages/conversation", {
          receiverId: userId,
        });

        const newChat = res.data.conversation;

        // 🔥 avoid duplicate in state
        setConversations((prev) => {
          const exists = prev.find(
            (c) => String(c._id) === String(newChat._id)
          );
          if (exists) return prev;
          return [newChat, ...prev];
        });

        setCurrentChat(newChat);
      } catch (err) {
        console.error(err);
      }
    };

    openChat();
  }, [userId]);

  // ================= SOCKET UPDATE =================
  useEffect(() => {
    const handleNewMessage = (msg) => {
      setConversations((prev) => {
        const updated = [...prev];

        const index = updated.findIndex(
          (c) => String(c._id) === String(msg.conversationId)
        );

        if (index !== -1) {
          updated[index].lastMessage = msg.text;

          const [chat] = updated.splice(index, 1);
          updated.unshift(chat);
        }

        return updated;
      });
    };

    socket.on("receiveMessage", handleNewMessage);
    socket.on("messageSent", handleNewMessage);

    return () => {
      socket.off("receiveMessage", handleNewMessage);
      socket.off("messageSent", handleNewMessage);
    };
  }, []);

  // ================= DEFAULT SELECT =================
  useEffect(() => {
    if (!userId && conversations.length > 0) {
      setCurrentChat(conversations[0]);
    }
  }, [conversations, userId]);

  // ================= UI =================
  return (
    <div className="chat-page">
      <ChatSidebar
        conversations={conversations}
        setCurrentChat={setCurrentChat}
        user={user}
        currentChat={currentChat}
      />
      <ChatBox currentChat={currentChat} user={user} />
    </div>
  );
}
