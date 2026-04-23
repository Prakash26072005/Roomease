// socket.js
// import { io } from "socket.io-client";

// export const socket = io(import.meta.env.VITE_API_URL, {
//   withCredentials: true,
// });
 import { io } from "socket.io-client";
export const socket = io(import.meta.env.VITE_API_URL, {
  withCredentials: true,
  transports: ["websocket", "polling"], // Add this for Render stability
});