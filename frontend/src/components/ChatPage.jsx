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
//   const [isMobileChatOpen, setIsMobileChatOpen] = useState(false);

//   const user = JSON.parse(localStorage.getItem("user"));
//   const { userId } = useParams();

//   const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

//   // ================= MOBILE DETECT =================
//   useEffect(() => {
//     const handleResize = () => {
//       setIsMobile(window.innerWidth <= 768);
//     };

//     window.addEventListener("resize", handleResize);
//     return () => window.removeEventListener("resize", handleResize);
//   }, []);

//   // ================= VALID OBJECT ID =================
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

//     // 🔥 check if already exists
//     const existing = conversations.find((c) =>
//       c.members?.some((m) => String(m._id) === String(userId))
//     );

//     if (existing) {
//       setCurrentChat(existing);
//       if (isMobile) setIsMobileChatOpen(true);
//       return;
//     }

//     // 🔥 otherwise create conversation
//     const openChat = async () => {
//       try {
//         const res = await api.post("/api/messages/conversation", {
//           receiverId: userId,
//         });

//         const newChat = res.data.conversation;

//         setConversations((prev) => {
//           const exists = prev.find(
//             (c) => String(c._id) === String(newChat._id)
//           );
//           if (exists) return prev;
//           return [newChat, ...prev];
//         });

//         setCurrentChat(newChat);
//         if (isMobile) setIsMobileChatOpen(true);
//       } catch (err) {
//         console.error(err);
//       }
//     };

//     openChat();
//   }, [userId, conversations, isMobile]);

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

//           // 🔥 move to top
//           const [chat] = updated.splice(index, 1);
//           updated.unshift(chat);
//         }

//         return updated;
//       });
//       fetchConversations();
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
//         setCurrentChat={(chat) => {
//           setCurrentChat(chat);
//           if (isMobile) setIsMobileChatOpen(true);
//         }}
//         user={user}
//         currentChat={currentChat}
//         isMobileChatOpen={isMobileChatOpen}
//       />

//       {/* Desktop always show | Mobile only when open */}
//       {(!isMobile || isMobileChatOpen) && (
//         <ChatBox
//           currentChat={currentChat}
//           user={user}
//           setIsMobileChatOpen={setIsMobileChatOpen}
//         />
//       )}

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
  const [isMobileChatOpen, setIsMobileChatOpen] = useState(false);
const [loadingConversations, setLoadingConversations] = useState(true);
  const user = JSON.parse(localStorage.getItem("user"));
  const { userId } = useParams();

  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  // ================= MOBILE DETECT =================
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // ================= VALID OBJECT ID =================
  const isValidObjectId = (id) =>
    /^[0-9a-fA-F]{24}$/.test(id);

  // ================= LOAD CONVERSATIONS =================
const fetchConversations = useCallback(async () => {
  try {
    const res = await api.get("/api/messages/conversations/my");
    setConversations(res.data.conversations);
  } catch (err) {
    console.error(err);
  } finally {
    setLoadingConversations(false); // 🔥 important
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
 useEffect(() => {
  if (!userId || !isValidObjectId(userId)) return;

  // 🔥 WAIT only until loading
  if (loadingConversations) return;

  const existing = conversations.find((c) =>
    c.members?.some((m) => String(m._id) === String(userId))
  );

  if (existing) {
    setCurrentChat(existing);
    if (isMobile) setIsMobileChatOpen(true);
    return;
  }

  const openChat = async () => {
    try {
      const res = await api.post("/api/messages/conversation", {
        receiverId: userId,
      });

      const newChat = res.data.conversation;

      setConversations((prev) => [newChat, ...prev]);
      setCurrentChat(newChat);
      if (isMobile) setIsMobileChatOpen(true);
    } catch (err) {
      console.error(err);
    }
  };

  openChat();
}, [userId, conversations, isMobile, loadingConversations]);  // ================= SOCKET UPDATE =================
  useEffect(() => {
    const handleNewMessage = (msg) => {
      setConversations((prev) => {
        const updated = [...prev];

        const index = updated.findIndex(
          (c) => String(c._id) === String(msg.conversationId)
        );

        if (index !== -1) {
          updated[index].lastMessage = msg.text;

          // 🔥 move to top
          const [chat] = updated.splice(index, 1);
          updated.unshift(chat);
        }

        return updated;
      });
      fetchConversations();
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
  if (!userId && conversations.length > 0 && !isMobile) {
    setCurrentChat(conversations[0]);
  }
}, [conversations, userId, isMobile]);

  // ================= UI =================
  return (
    <div className="chat-page">

      <ChatSidebar
        conversations={conversations}
        setCurrentChat={(chat) => {
          setCurrentChat(chat);
          if (isMobile) setIsMobileChatOpen(true);
        }}
        user={user}
        currentChat={currentChat}
        isMobileChatOpen={isMobileChatOpen}
      />

      {/* Desktop always show | Mobile only when open */}
      {(!isMobile || isMobileChatOpen) && (
        <ChatBox
          currentChat={currentChat}
          user={user}
          setIsMobileChatOpen={setIsMobileChatOpen}
        />
      )}

    </div>
  );
}
