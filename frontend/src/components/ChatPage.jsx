
// import React, { useEffect, useState, useCallback, useRef } from "react";
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
//   const [chatError, setChatError] = useState("");
//   const openingUserIdRef = useRef("");

//   const user = JSON.parse(localStorage.getItem("user"));
//   const { userId } = useParams();

//   const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

//   // ================= MOBILE =================
//   useEffect(() => {
//     const handleResize = () => {
//       setIsMobile(window.innerWidth <= 768);
//     };
//     window.addEventListener("resize", handleResize);
//     return () => window.removeEventListener("resize", handleResize);
//   }, []);

//   const isValidObjectId = (id) =>
//     /^[0-9a-fA-F]{24}$/.test(id);

//   // ================= FETCH =================
//   const fetchConversations = useCallback(async () => {
//     try {
//       const res = await api.get("/api/messages/conversations/my");

//       // 🔥 CLEAN DATA
//       const clean = (res.data.conversations || []).filter(
//         (c) => c && c._id && Array.isArray(c.members)
//       );

//       setConversations(clean);
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
//   }, []);

//   // ================= OPEN CHAT =================
//   useEffect(() => {
//     if (!userId || !isValidObjectId(userId)) return;

//     // ❌ self chat block
//     if (user && String(user._id) === String(userId)) {
//       setChatError("You cannot chat with yourself.");
//       return;
//     }

//     // 🔥 SAFE FIND
//     const existing = conversations.find((c) =>
//       c &&
//       c.members &&
//       c.members.some(
//         (m) => m && m._id && String(m._id) === String(userId)
//       )
//     );

//     if (existing) {
//       setChatError("");
//       openingUserIdRef.current = "";
//       setCurrentChat(existing);
//       if (isMobile) setIsMobileChatOpen(true);
//       return;
//     }

//     if (openingUserIdRef.current === userId) return;
//     openingUserIdRef.current = userId;

//     // 🔥 CREATE NEW
//     const openChat = async () => {
//       try {
//         setChatError("");
//         const res = await api.post("/api/messages/conversation", {
//           receiverId: userId,
//         });

//         const newChat = res.data.conversation;

//         if (!newChat?._id || !Array.isArray(newChat.members)) {
//           throw new Error("Conversation was not created");
//         }

//         setConversations((prev) =>
//           [newChat, ...prev].filter(
//             (c) => c && c._id && c.members
//           )
//         );

//         setCurrentChat(newChat);
//         if (isMobile) setIsMobileChatOpen(true);
//       } catch (err) {
//         console.error("Chat open error:", err);
//         setChatError(
//           err.response?.data?.message ||
//             "Unable to open this chat. Please try again."
//         );
//         openingUserIdRef.current = "";
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
//           (c) =>
//             c &&
//             c._id &&
//             String(c._id) === String(msg.conversationId)
//         );

//         if (index !== -1) {
//           updated[index].lastMessage = msg.text;

//           const [chat] = updated.splice(index, 1);
//           updated.unshift(chat);
//         }

//         return updated.filter(
//           (c) => c && c._id && c.members
//         );
//       });
//     };

//     socket.on("receiveMessage", handleNewMessage);
//     socket.on("messageSent", handleNewMessage);

//     return () => {
//       socket.off("receiveMessage", handleNewMessage);
//       socket.off("messageSent", handleNewMessage);
//     };
//   }, []);


//   // ================= DEFAULT =================
//   useEffect(() => {
//     if (!userId && conversations.length > 0) {
//       setCurrentChat(conversations[0]);
//     }
//   }, [conversations, userId]);

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

//       {(!isMobile || isMobileChatOpen) && (
//         chatError ? (
//           <h2>{chatError}</h2>
//         ) : (
//           <ChatBox
//             currentChat={currentChat}
//             user={user}
//             setIsMobileChatOpen={setIsMobileChatOpen}
//           />
//         )
//       )}
//     </div>
//   );
// }


import React, { useEffect, useState, useCallback, useRef } from "react";
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
  const [chatError, setChatError] = useState("");
  const openingUserIdRef = useRef("");

  const user = JSON.parse(localStorage.getItem("user"));
  const { userId } = useParams();

  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  // ================= MOBILE =================
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const isValidObjectId = (id) =>
    /^[0-9a-fA-F]{24}$/.test(id);

  // ================= FETCH =================
  const fetchConversations = useCallback(async () => {
    try {
      const res = await api.get("/api/messages/conversations/my");

      const clean = (res.data.conversations || []).filter(
        (c) => c && c._id && Array.isArray(c.members)
      );

      setConversations(clean);
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
  }, []);

  // ================= OPEN CHAT =================
  useEffect(() => {
    if (!userId || !isValidObjectId(userId)) return;

    // ❌ self chat block
    if (user && String(user._id) === String(userId)) {
      setChatError("You cannot chat with yourself.");
      return;
    }

    // 🔥 SAFE FIND
    const existing = conversations.find((c) =>
      c?.members?.some(
        (m) => m?._id && String(m._id) === String(userId)
      )
    );

    if (existing) {
      setChatError("");
      openingUserIdRef.current = "";
      setCurrentChat(existing);
      if (isMobile) setIsMobileChatOpen(true);
      return;
    }

    if (openingUserIdRef.current === userId) return;
    openingUserIdRef.current = userId;

    // 🔥 CREATE NEW
    const openChat = async () => {
      try {
        setChatError("");

        const res = await api.post("/api/messages/conversation", {
          receiverId: userId,
        });

        const newChat = res.data.conversation;

        if (!newChat?._id || !Array.isArray(newChat.members)) {
          throw new Error("Conversation was not created");
        }

        // ✅ FIX: no duplicate add
        setConversations((prev) => {
          const exists = prev.some(
            (c) => String(c._id) === String(newChat._id)
          );

          if (exists) return prev;

          return [newChat, ...prev];
        });

        setCurrentChat(newChat);
        if (isMobile) setIsMobileChatOpen(true);
      } catch (err) {
        console.error("Chat open error:", err);
        setChatError(
          err.response?.data?.message ||
            "Unable to open this chat. Please try again."
        );
        openingUserIdRef.current = "";
      }
    };

    openChat();
  }, [userId, conversations, isMobile]);

  // ================= SOCKET UPDATE =================
useEffect(() => {
  const handleNewMessage = (msg) => {
    setConversations((prev) => {
      // ✅ already updated? skip
      const exists = prev.find(
        (c) =>
          String(c._id) === String(msg.conversationId) &&
          c.lastMessage === msg.text
      );

      if (exists) return prev;

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

  // ✅ BOTH EVENTS (important)
  socket.on("receiveMessage", handleNewMessage);
  socket.on("messageSent", handleNewMessage);

  return () => {
    socket.off("receiveMessage", handleNewMessage);
    socket.off("messageSent", handleNewMessage);
  };
}, []);

  // ================= DEFAULT =================
  useEffect(() => {
    if (!userId && conversations.length > 0) {
      setCurrentChat(conversations[0]);
    }
  }, [conversations, userId]);

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

      {(!isMobile || isMobileChatOpen) && (
        chatError ? (
          <h2>{chatError}</h2>
        ) : (
          <ChatBox
            currentChat={currentChat}
            user={user}
            setIsMobileChatOpen={setIsMobileChatOpen}
          />
        )
      )}
    </div>
  );
}