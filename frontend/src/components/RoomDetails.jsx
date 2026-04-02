// import { useParams, useNavigate } from "react-router-dom";
// import React, { useEffect, useState } from "react";
// import RoomSlider from "./RoomSlider";

// export default function RoomDetails() {
//   const { id } = useParams();
//   const navigate = useNavigate();

//   const [room, setRoom] = useState(null);
//   const [startDate, setStartDate] = useState("");

//   const storedUser = localStorage.getItem("user");
//   const user = storedUser ? JSON.parse(storedUser) : null;

//   useEffect(() => {
//     fetch(`http://localhost:5000/api/rooms/${id}`)
//       .then((res) => res.json())
//       .then((data) => {
//         if (data.success) setRoom(data.room);
//       });
//   }, [id]);

//   const payNow = async () => {
//     if (!startDate) {
//       alert("Please select start date");
//       return;
//     }

//     const res = await fetch("http://localhost:5000/api/payment/create-order", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ amount: room.price }),
//     });

//     const order = await res.json();

//     const options = {
//       key: "rzp_test_Rz1iDhnb8kUV4M",
//       amount: order.amount,
//       currency: "INR",
//       name: "RoomEase",
//       description: room.title,
//       order_id: order.id,
//       handler: async function (response) {
//         try {
//           const verifyRes = await fetch(
//             "http://localhost:5000/api/payment/verify",
//             {
//               method: "POST",
//               headers: { "Content-Type": "application/json" },
//             body: JSON.stringify({
//   razorpay_order_id: response.razorpay_order_id,
//   razorpay_payment_id: response.razorpay_payment_id,
//   razorpay_signature: response.razorpay_signature,
//   roomId: room._id,
//   startDate,
// }),
//             }
//           );

//           const data = await verifyRes.json();

//           if (!verifyRes.ok || !data.success) {
//             alert("Payment verification failed");
//             return;
//           }

//           alert("Booking confirmed!");
//         } catch (err) {
//           alert("Something went wrong");
//         }
//       },
//     };

//     new window.Razorpay(options).open();
//   };

//   if (!room) return <h1>Loading...</h1>;

//   return (
//     <div>
//       <RoomSlider images={room.images.map((img) => img.url)} />

//       <h2>{room.title}</h2>
//       <p>{room.location.address}</p>
//       <p>{room.description}</p>
//       <p>
//         <strong>Owner:</strong> {room.owner?.name}
//       </p>

//       <h3>₹{room.price} / month</h3>

//       <label>Rent Start Date:</label>
//       <br />
//       <input
//         type="date"
//         value={startDate}
//         onChange={(e) => setStartDate(e.target.value)}
//       />

//       <br />
//       <br />
//       <button onClick={payNow}>Pay & Book</button>

//       {/* ✅ CHAT BUTTON ADDED HERE */}
//       {user &&
//         room?.owner &&
//         user._id?.toString() !== room.owner._id?.toString() && (
//           <>
//             <br />
//             <br />
//             <button
//               onClick={() => navigate("/chat-dashboard")}
//               style={{
//                 background: "#25D366",
//                 color: "white",
//                 padding: "10px 15px",
//                 border: "none",
//                 borderRadius: "5px",
//                 cursor: "pointer",
//               }}
//             >
//               💬 Chat with Owner
//             </button>
//           </>
//         )}

//       <h3>Location</h3>
//       <iframe
//         src={`https://www.google.com/maps?q=${room.location.lat},${room.location.lng}&z=15&output=embed`}
//         width="100%"
//         height="300"
//         style={{ border: 0, borderRadius: "10px" }}
//         loading="lazy"
//         title="Room Location"
//       />

//       <a
//         href={`https://www.google.com/maps?q=${room.location.lat},${room.location.lng}`}
//         target="_blank"
//         rel="noopener noreferrer"
//       >
//         📍 Open in Google Maps
//       </a>
//     </div>
//   );
// }


import { useParams, useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import RoomSlider from "./RoomSlider";
import api from "../utils/axios";

export default function RoomDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [room, setRoom] = useState(null);
  const [startDate, setStartDate] = useState("");
  const [user, setUser] = useState(null);

  // ================= FETCH ROOM =================
  useEffect(() => {
    const fetchRoom = async () => {
      try {
        const res = await api.get(`/api/rooms/${id}`);
        if (res.data.success) {
          setRoom(res.data.room);
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchRoom();
  }, [id]);

  // ================= GET LOGGED USER =================
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get("/api/auth/me");
        if (res.data.success) {
          setUser(res.data.user);
        }
      } catch {
        setUser(null);
      }
    };

    fetchUser();
  }, []);

  // ================= PAYMENT =================
  const payNow = async () => {
    if (!startDate) {
      alert("Please select start date");
      return;
    }

    try {
      // 🔥 Create order
    const res = await api.post("/api/payment/create-order", {
  amount: room.price,
});

const order = res.data.order; // ✅ FIX

      const options = {
        key: "rzp_test_Rz1iDhnb8kUV4M",
        amount: order.amount,
        currency: "INR",
        name: "RoomEase",
        description: room.title,
        order_id: order.id,

        handler: async function (response) {
          try {
            // 🔥 VERIFY PAYMENT
            const verifyRes = await api.post("/api/payment/verify", {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              roomId: room._id,
              startDate,
            });

            if (!verifyRes.data.success) {
              alert("Payment verification failed");
              return;
            }

            alert("Booking confirmed!");
            navigate("/my-bookings");
          } catch (err) {
            console.error(err);
            alert("Verification failed");
          }
        },
      };

      new window.Razorpay(options).open();
    } catch (err) {
      console.error(err);
      alert("Payment failed");
    }
  };

  if (!room) return <h1>Loading...</h1>;

  // ================= UI =================
  return (
    <div>
      <RoomSlider images={room.images.map((img) => img.url)} />

      <h2>{room.title}</h2>
      <p>{room.location.address}</p>
      <p>{room.description}</p>

      <p>
        <strong>Owner:</strong> {room.owner?.name}
      </p>

      <h3>₹{room.price} / month</h3>

      <label>Rent Start Date:</label>
      <br />
      <input
        type="date"
        value={startDate}
        onChange={(e) => setStartDate(e.target.value)}
      />

      <br />
      <br />

      <button onClick={payNow}>Pay & Book</button>

      {/* ================= CHAT BUTTON ================= */}
      {user &&
        room?.owner &&
        user._id?.toString() !== room.owner._id?.toString() && (
          <>
            <br />
            <br />
            <button
              onClick={() => navigate(`/chatpage/${room.owner._id}`)}
              style={{
                background: "#25D366",
                color: "white",
                padding: "10px 15px",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
              }}
            >
              💬 Chat with Owner
            </button>
          </>
        )}

      {/* ================= MAP ================= */}
      <h3>Location</h3>

      <iframe
        src={`https://www.google.com/maps?q=${room.location.lat},${room.location.lng}&z=15&output=embed`}
        width="100%"
        height="300"
        style={{ border: 0, borderRadius: "10px" }}
        loading="lazy"
        title="Room Location"
      />

      <a
        href={`https://www.google.com/maps?q=${room.location.lat},${room.location.lng}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        📍 Open in Google Maps
      </a>
    </div>
  );
}