import React, { useEffect, useState } from "react";
import ChatSidebar from "../pages/ChatSidebar";
import ChatBox from "../pages/ChatBox";
import { socket } from "../socket";
import api from "../utils/axios";

export default function ChatPage() {
  const [conversations, setConversations] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);

  const user = JSON.parse(localStorage.getItem("user"));

  // 🔥 load conversations
  useEffect(() => {
    api.get("/api/messages/conversations/my").then((res) => {
      setConversations(res.data.conversations);
    });
  }, []);

  // 🔥 socket join
  useEffect(() => {
    socket.emit("join", user._id);
  }, []);

  return (
    <div style={{ display: "flex" }}>
      <ChatSidebar
        conversations={conversations}
        setCurrentChat={setCurrentChat}
        user={user}
      />

      <ChatBox currentChat={currentChat} user={user} />
    </div>
  );
}