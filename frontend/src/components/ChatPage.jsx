// import React, { useEffect, useState, useCallback } from "react";
// import ChatSidebar from "../pages/ChatSidebar";
// import ChatBox from "../pages/ChatBox";
// import { socket } from "../socket";
// import api from "../utils/axios";
// import { useParams } from "react-router-dom";

// export default function ChatPage() {
//   const [conversations, setConversations] = useState([]);
//   const [currentChat, setCurrentChat] = useState(null);

//   const user = JSON.parse(localStorage.getItem("user"));
//   const { userId } = useParams();
//   const isValidObjectId = (id) => {
//   return /^[0-9a-fA-F]{24}$/.test(id);
// };

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


// //   useEffect(() => {
// //   if (!userId || !isValidObjectId(userId)) return;

// //   const openChat = async () => {
// //     try {
// //       const res = await api.post("/api/messages/conversation", {
// //         receiverId: userId,
// //       });

// //       setCurrentChat(res.data.conversation);
// //       fetchConversations();
// //     } catch (err) {
// //       console.error(err);
// //     }
// //   };

// //   openChat();
// // }, [userId, fetchConversations]);


// useEffect(() => {
//   if (!userId || !isValidObjectId(userId)) return;

//   const openChat = async () => {
//     try {
//       const res = await api.post("/api/messages/conversation", {
//         receiverId: userId,
//       });

//       const newChat = res.data.conversation;

//       // ✅ set current chat immediately
//       setCurrentChat(newChat);

//       // ✅ update sidebar AFTER
//       const convRes = await api.get("/api/messages/conversations/my");
//       setConversations(convRes.data.conversations);

//     } catch (err) {
//       console.error(err);
//     }
//   };

//   openChat();
// }, [userId]);

//   // ================= DEFAULT SELECT FIRST CHAT =================
//   useEffect(() => {
//     if (!userId && conversations.length > 0 && !currentChat) {
//       setCurrentChat(conversations[0]);
//     }
//   }, [conversations, userId, currentChat]);

//   return (
//     <div style={{ display: "flex", height: "90vh" }}>
//    <ChatSidebar
//   conversations={conversations}
//   setCurrentChat={setCurrentChat}
//   user={user}
//   currentChat={currentChat}
// />

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

export default function ChatPage() {
  const [conversations, setConversations] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);

  const user = JSON.parse(localStorage.getItem("user"));
  const { userId } = useParams();

  const isValidObjectId = (id) => {
    return /^[0-9a-fA-F]{24}$/.test(id);
  };

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
  useEffect(() => {
    if (!userId || !isValidObjectId(userId)) return;

    const openChat = async () => {
      try {
        const res = await api.post("/api/messages/conversation", {
          receiverId: userId,
        });

        const newChat = res.data.conversation;

        // 🔥 get updated conversations
        const convRes = await api.get("/api/messages/conversations/my");
        const updatedConvs = convRes.data.conversations;

        setConversations(updatedConvs);

        // 🔥 IMPORTANT: match from sidebar list
        const matchedChat = updatedConvs.find(
          (c) => c._id === newChat._id
        );

        setCurrentChat(matchedChat || newChat);
      } catch (err) {
        console.error(err);
      }
    };

    openChat();
  }, [userId]);

  // ================= DEFAULT SELECT FIRST CHAT =================
  useEffect(() => {
    if (!userId && conversations.length > 0 && !currentChat) {
      setCurrentChat(conversations[0]);
    }
  }, [conversations, userId, currentChat]);

  // ================= UI =================
  return (
    <div style={{ display: "flex", height: "90vh" }}>
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