import { useEffect, useState } from "react";
import api from "../utils/axios";
import { socket } from "../socket";
import MessageBubble from "./MessageBubble";

export default function ChatBox({ currentChat, user }) {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");

  const receiverId =
    currentChat?.members.find((m) => m._id !== user._id)?._id;

  // load messages
  useEffect(() => {
    if (!currentChat) return;

    api.get(`/api/messages/${currentChat._id}`).then((res) => {
      setMessages(res.data.messages);
    });
  }, [currentChat]);

  // receive real-time
  useEffect(() => {
    socket.on("receiveMessage", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });
  }, []);

  const sendMessage = async () => {
    const res = await api.post("/api/messages/send", {
      receiverId,
      text,
    });

    socket.emit("sendMessage", {
      receiverId,
      message: res.data.message,
    });

    setMessages((prev) => [...prev, res.data.message]);
    setText("");
  };

  if (!currentChat) return <h2>Select a chat</h2>;

  return (
    <div style={{ flex: 1 }}>
      <div>
        {messages.map((m, i) => (
          <p key={i}>
            {m.sender === user._id ? "Me: " : "User: "}
           <MessageBubble message={m} own={m.sender === user._id} />
          </p>
        ))}
      </div>

      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
}