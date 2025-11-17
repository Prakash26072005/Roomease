import React from "react";
import Navbar from "./navbar";

export default function Dashboard() {
  const user = JSON.parse(localStorage.getItem("user") || "null");

  return (
    <>
      <Navbar />
      <div style={{ padding: "20px" }}>
        <h1>Dashboard</h1>
        {user ? (
          <>
            <p>Name: {user.name}</p>
            <p>Email: {user.email}</p>
            <p>GoogleId: {user.googleId || "—"}
      </p>

          </>
        ) : (
          <p>Not logged in</p>
        )}
      </div>
    </>
  );
}
