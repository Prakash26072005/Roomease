
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

//     // ❌ self chat
//     if (user && String(user._id) === String(userId)) {
//       setChatError("You cannot chat with yourself.");
//       return;
//     }

//     // 🔥 WAIT for conversations (IMPORTANT FIX)
//     if (conversations.length === 0) return;

//     const existing = conversations.find((c) =>
//       c?.members?.some(
//         (m) => m?._id && String(m._id) === String(userId)
//       )
//     );

//     // ✅ existing chat open
//     if (existing) {
//       setChatError("");
//       openingUserIdRef.current = "";
//       setCurrentChat(existing);
//       if (isMobile) setIsMobileChatOpen(true);
//       return;
//     }

//     // ❌ prevent multiple API calls
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

//         // ✅ FIX: avoid duplicate
//         setConversations((prev) => {
//           const exists = prev.some(
//             (c) => String(c._id) === String(newChat._id)
//           );
//           if (exists) return prev;
//           return [newChat, ...prev];
//         });

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
//           (c) => String(c._id) === String(msg.conversationId)
//         );

//         if (index !== -1) {
//           // ✅ prevent duplicate update
//           if (updated[index].lastMessage === msg.text) return prev;

//           updated[index].lastMessage = msg.text;

//           const [chat] = updated.splice(index, 1);
//           updated.unshift(chat);
//         }

//         return updated;
//       });
//     };

//     // ✅ KEEP BOTH (important for your backend)
//     socket.on("receiveMessage", handleNewMessage);
//     socket.on("messageSent", handleNewMessage);

//     return () => {
//       socket.off("receiveMessage", handleNewMessage);
//       socket.off("messageSent", handleNewMessage);
//     };
//   }, []);

//   // ================= DEFAULT =================
//   useEffect(() => {
//     if (conversations.length > 0 && !currentChat) {
//       setCurrentChat(conversations[0]);
//     }
//   }, [conversations]);

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

      console.log("✅ Conversations fetched:", clean);
      setConversations(clean);
    } catch (err) {
      console.error("❌ Error fetching conversations:", err);
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

  // ================= OPEN CHAT FROM URL =================
  useEffect(() => {
    // Only handle direct URL access with userId parameter
    if (!userId || !isValidObjectId(userId)) {
      console.log("⏭️  No valid userId in URL:", userId);
      return;
    }

    console.log("🔍 Opening chat from URL with userId:", userId);

    if (user && String(user._id) === String(userId)) {
      setChatError("You cannot chat with yourself.");
      return;
    }

    // Wait for conversations to load
    if (conversations.length === 0) {
      console.log("⏳ Waiting for conversations to load...");
      return;
    }

    console.log("📋 Searching in conversations:", conversations.length);

    const existing = conversations.find((c) => {
      if (!c?.members || c.members.length === 0) return false;
      
      // Support both object references and ID strings
      return c.members.some((m) => {
        const memberId = m?._id || m;
        return String(memberId) === String(userId);
      });
    });

    if (existing) {
      console.log("✅ Found existing chat:", existing);
      setChatError("");
      setCurrentChat(existing);
      if (isMobile) setIsMobileChatOpen(true);
      return;
    }

    // Prevent duplicate API calls
    if (openingUserIdRef.current === userId) {
      console.log("⏭️  Already opening this chat, skipping...");
      return;
    }
    openingUserIdRef.current = userId;

    // Create new conversation
    const openChat = async () => {
      try {
        console.log("➕ Creating new conversation with userId:", userId);
        const res = await api.post("/api/messages/conversation", {
          receiverId: userId,
        });

        const newChat = res.data.conversation;
        console.log("✅ New conversation created:", newChat);
        
        // Ensure members are properly formatted
        if (!newChat?.members || newChat.members.length === 0) {
          console.error("❌ Invalid conversation structure:", newChat);
          setChatError("Failed to create conversation. Please try again.");
          openingUserIdRef.current = "";
          return;
        }

        setConversations((prev) => [newChat, ...prev]);
        setCurrentChat(newChat);

        if (isMobile) setIsMobileChatOpen(true);
      } catch (err) {
        console.error("❌ Error creating conversation:", err);
        setChatError(
          err.response?.data?.message || "Unable to open this chat."
        );
        openingUserIdRef.current = "";
      }
    };

    openChat();
  }, [userId, conversations, isMobile, user]);
  // ================= SOCKET UPDATE =================
  useEffect(() => {
    const handleNewMessage = (msg) => {
      setConversations((prev) => {
        const updated = [...prev];

        const index = updated.findIndex(
          (c) => String(c._id) === String(msg.conversationId)
        );

        if (index !== -1) {
          // ✅ prevent duplicate update
          if (updated[index].lastMessage === msg.text) return prev;

          updated[index].lastMessage = msg.text;

          const [chat] = updated.splice(index, 1);
          updated.unshift(chat);
        }

        return updated;
      });
    };

    // ✅ KEEP BOTH (important for your backend)
    socket.on("receiveMessage", handleNewMessage);
    socket.on("messageSent", handleNewMessage);

    return () => {
      socket.off("receiveMessage", handleNewMessage);
      socket.off("messageSent", handleNewMessage);
    };
  }, []);

  // ================= DEFAULT =================
  useEffect(() => {
    if (conversations.length > 0 && !currentChat && !userId) {
      setCurrentChat(conversations[0]);
    }
  }, [conversations]);

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