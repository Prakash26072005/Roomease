export default function ChatSidebar({ conversations, setCurrentChat, user }) {
  return (
    <div style={{ width: "30%", borderRight: "1px solid #ccc" }}>
      {conversations.map((c) => {
        const otherUser = c.members.find(
          (m) => m._id !== user._id
        );

        return (
          <div key={c._id} onClick={() => setCurrentChat(c)}>
            <h4>{otherUser.name}</h4>
            <p>{c.lastMessage}</p>
          </div>
        );
      })}
    </div>
  );
}