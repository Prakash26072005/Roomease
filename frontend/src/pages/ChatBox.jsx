import "../styles/ChatBox.css";
import { useEffect, useState, useRef } from "react";
import api from "../utils/axios";
import { socket } from "../socket";
import MessageBubble from "./MessageBubble";
import SendIcon from "@mui/icons-material/Send";

export default function ChatBox({ currentChat, user, setIsMobileChatOpen }) {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const scrollRef = useRef(null);
  const lastMsgIdRef = useRef(null);

  // 🔥 receiver
  const receiverId =
    currentChat?.members?.find(
      (m) => m?._id && m._id.toString() !== user._id.toString()
    )?._id;

  // 🔥 other user
  const otherUser = currentChat?.members?.find(
    (m) => m?._id && m._id.toString() !== user._id.toString()
  );

  // ================= LOAD =================
  useEffect(() => {
    if (!currentChat?._id) return;

    api.get(`/api/messages/${currentChat._id}`).then((res) => {
      setMessages(res.data.messages || []);
    });
  }, [currentChat]);

  // ================= SOCKET =================
  useEffect(() => {
    const handleReceive = (msg) => {
      if (
        msg.conversationId.toString() !==
        currentChat?._id.toString()
      ) return;

      // ❌ same message twice (socket duplicate)
      if (lastMsgIdRef.current === msg._id) return;
      lastMsgIdRef.current = msg._id;

      setMessages((prev) => {
        // ✅ already exists
        if (prev.some((m) => m._id === msg._id)) return prev;

        // ✅ replace optimistic message
        const tempIndex = prev.findIndex(
          (m) =>
            m.pending &&
            m.text === msg.text &&
            m.sender.toString() === msg.sender.toString()
        );

        if (tempIndex !== -1) {
          const updated = [...prev];
          updated[tempIndex] = msg;
          return updated;
        }

        return [...prev, msg];
      });
    };

    // ✅ keep both (backend compatible)
    socket.on("receiveMessage", handleReceive);
    socket.on("messageSent", handleReceive);

    return () => {
      socket.off("receiveMessage", handleReceive);
      socket.off("messageSent", handleReceive);
    };
  }, [currentChat]);

  // ================= SCROLL =================
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // ================= SEND =================
  const sendMessage = () => {
    if (!text.trim() || !receiverId) return;

    const tempId = Date.now();

    const newMsg = {
      _id: tempId,
      sender: user._id,
      text,
      conversationId: currentChat._id,
      pending: true, // 🔥 important
    };

    // ✅ optimistic
    setMessages((prev) => [...prev, newMsg]);

    socket.emit("sendMessage", {
      senderId: user._id,
      receiverId,
      text,
    });

    setText("");
  };

  // ================= ENTER =================
  const handleKeyDown = (e) => {
    if (e.key === "Enter") sendMessage();
  };

  // ================= EMPTY =================
  if (!currentChat || !currentChat.members) {
    return <h2>Select a chat</h2>;
  }

  // ================= UI =================
  return (
    <div className="chatbox">
      {/* HEADER */}
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

      {/* MESSAGES */}
      <div className="chat-messages">
        {messages.map((m, i) => (
          <div
            key={m._id || i}
            ref={i === messages.length - 1 ? scrollRef : null}
          >
            <MessageBubble
              message={m}
              own={
                m.sender &&
                user &&
                m.sender.toString() === user._id.toString()
              }
            />
          </div>
        ))}
      </div>

      {/* INPUT */}
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