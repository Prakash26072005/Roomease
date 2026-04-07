// import { useEffect, useState } from "react";
// import api from "../utils/axios";
// import { socket } from "../socket";
// import MessageBubble from "./MessageBubble";

// export default function ChatBox({ currentChat, user }) {
//   const [messages, setMessages] = useState([]);
//   const [text, setText] = useState("");

//   const receiverId =
//     currentChat?.members.find((m) => m._id !== user._id)?._id;

//   // load messages
//   useEffect(() => {
//     if (!currentChat) return;

//     api.get(`/api/messages/${currentChat._id}`).then((res) => {
//       setMessages(res.data.messages);
//     });
//   }, [currentChat]);


//   useEffect(() => {
//   socket.on("receiveMessage", (msg) => {
//     setMessages((prev) => [...prev, msg]);
//   });

//   socket.on("messageSent", (msg) => {
//     setMessages((prev) => [...prev, msg]);
//   });

//   return () => {
//     socket.off("receiveMessage");
//     socket.off("messageSent");
//   };
// }, []);


//   const sendMessage = () => {
//   if (!text.trim()) return;

//   socket.emit("sendMessage", {
//     senderId: user._id,
//     receiverId,
//     text,
//   });

//   setText("");
// };

//   if (!currentChat) return <h2>Select a chat</h2>;

//   return (
//     <div style={{ flex: 1 }}>
//       <div>
//         {messages.map((m, i) => (
//           <p key={i}>
//             {m.sender.toString() === user._id.toString() ? "Me: " : "User: "}
//            <MessageBubble message={m} own={m.sender === user._id} />
//           </p>
//         ))}
//       </div>

//       <input
//         value={text}
//         onChange={(e) => setText(e.target.value)}
//       />
//       <button onClick={sendMessage}>Send</button>
//     </div>
//   );
// }


import { useEffect, useState } from "react";
import api from "../utils/axios";
import { socket } from "../socket";
import MessageBubble from "./MessageBubble";

export default function ChatBox({ currentChat, user }) {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");

  // const receiverId =
  //   currentChat?.members.find((m) => m._id !== user._id)?._id;
const receiverId =
  currentChat?.members.find(
    (m) => m._id.toString() !== user._id.toString()
  )?._id;
  // load messages
  useEffect(() => {
    if (!currentChat) return;

    api.get(`/api/messages/${currentChat._id}`).then((res) => {
      setMessages(res.data.messages);
    });
  }, [currentChat]);


  useEffect(() => {
  socket.on("receiveMessage", (msg) => {
    setMessages((prev) => [...prev, msg]);
  });

  socket.on("messageSent", (msg) => {
    setMessages((prev) => [...prev, msg]);
  });

  return () => {
    socket.off("receiveMessage");
    socket.off("messageSent");
  };
}, []);


  const sendMessage = () => {
  if (!text.trim()) return;

  socket.emit("sendMessage", {
    senderId: user._id,
    receiverId,
    text,
  });

  setText("");
};

  if (!currentChat) return <h2>Select a chat</h2>;

  return (
    <div style={{ flex: 1 }}>
      <div>
        {messages.map((m, i) => (
          <p key={i}>
            {m.sender.toString() === user._id.toString() ? "Me: " : "User: "}
           <MessageBubble message={m} own={m.sender.toString() === user._id.toString()} />
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