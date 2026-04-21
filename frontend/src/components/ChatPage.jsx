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
  const user = JSON.parse(localStorage.getItem("user"));
  const { userId } = useParams();
const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

useEffect(() => {
  const handleResize = () => {
    setIsMobile(window.innerWidth <= 768);
  };

  window.addEventListener("resize", handleResize);
  return () => window.removeEventListener("resize", handleResize);
}, []);
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
    setCurrentChat={(chat) => {
      setCurrentChat(chat);
      if (isMobile) setIsMobileChatOpen(true);
    }}
    user={user}
    currentChat={currentChat}
    isMobileChatOpen={isMobileChatOpen}
  />

  {/* ✅ Desktop → always show */}
  {/* ✅ Mobile → show only when open */}
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
