import { useParams } from "react-router-dom";
import React, { useEffect, useState } from "react";
import RoomSlider from "./RoomSlider";

export default function RoomDetails() {
  const { id } = useParams();
  const [room, setRoom] = useState(null);
  const [startDate, setStartDate] = useState("");

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    fetch(`http://localhost:5000/api/rooms/${id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setRoom(data.room);
      });
  }, [id]);

  const payNow = async () => {
    if (!startDate) {
      alert("Please select start date");
      return;
    }

    const res = await fetch("http://localhost:5000/api/payment/create-order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount: room.price }),
    });

    const order = await res.json();

    const options = {
      key: "rzp_test_Rz1iDhnb8kUV4M",
      amount: order.amount,
      currency: "INR",
      name: "RoomEase",
      description: room.title,
      order_id: order.id,

    //   handler: async function (response) {
    //     await fetch("http://localhost:5000/api/payment/verify", {
    //       method: "POST",
    //       headers: { "Content-Type": "application/json" },
    //       body: JSON.stringify({
    //         razorpay_order_id: response.razorpay_order_id,
    //         razorpay_payment_id: response.razorpay_payment_id,
    //         razorpay_signature: response.razorpay_signature,
    //         roomId: room._id,
    //         userId: user._id,
    //         startDate,
    //       }),
    //     });

    //     alert("Booking confirmed!");
    //   },
    // };
handler: async function (response) {
  try {
    const verifyRes = await fetch("http://localhost:5000/api/payment/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        razorpay_order_id: response.razorpay_order_id,
        razorpay_payment_id: response.razorpay_payment_id,
        razorpay_signature: response.razorpay_signature,
        roomId: room._id,
        userId: user._id,
        startDate,
      }),
    });

    const data = await verifyRes.json();

    if (!verifyRes.ok || !data.success) {
      console.error("Verify failed:", data);
      alert("Payment verification failed");
      return;
    }

    alert("Booking confirmed!");
  } catch (err) {
    console.error("Verify error:", err);
    alert("Something went wrong while verifying payment");
  }
},};

    new window.Razorpay(options).open();
  };

  if (!room) return <h1>Loading...</h1>;

  return (
    <div>
      <RoomSlider images={room.images.map((img) => img.url)} />

      <h2>{room.title}</h2>
      <p>{room.location.address}</p>
      <p>{room.description}</p>
      <p><strong>Owner:</strong> {room.owner?.name}</p>

      <h3>₹{room.price} / month</h3>

      {/* Start Date */}
      <label>Rent Start Date:</label><br />
      <input
        type="date"
        value={startDate}
        onChange={(e) => setStartDate(e.target.value)}
      />

      <br /><br />
      <button onClick={payNow}>Pay & Book</button>

      
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
