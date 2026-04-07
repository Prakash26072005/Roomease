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

  // ================= AUTO OPEN / CREATE CHAT =================
  // useEffect(() => {
  //   if (!userId) return;

  //   const openChat = async () => {
  //     try {
  //       const res = await api.post("/api/messages/conversation", {
  //         receiverId: userId,
  //       });

  //       setCurrentChat(res.data.conversation);

  //       // refresh sidebar AFTER chat creation
  //       fetchConversations();
  //     } catch (err) {
  //       console.error(err);
  //     }
  //   };

  //   openChat();
  // }, [userId, fetchConversations]);

  useEffect(() => {
  if (!userId || !isValidObjectId(userId)) return;

  const openChat = async () => {
    try {
      const res = await api.post("/api/messages/conversation", {
        receiverId: userId,
      });

      setCurrentChat(res.data.conversation);
      fetchConversations();
    } catch (err) {
      console.error(err);
    }
  };

  openChat();
}, [userId, fetchConversations]);

  // ================= DEFAULT SELECT FIRST CHAT =================
  useEffect(() => {
    if (!userId && conversations.length > 0 && !currentChat) {
      setCurrentChat(conversations[0]);
    }
  }, [conversations, userId, currentChat]);

  return (
    <div style={{ display: "flex", height: "90vh" }}>
      <ChatSidebar
        conversations={conversations}
        setCurrentChat={setCurrentChat}
        user={user}
      />

      <ChatBox currentChat={currentChat} user={user} />
    </div>
  );
}