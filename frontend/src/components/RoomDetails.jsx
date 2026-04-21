import { useParams, useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import RoomSlider from "./RoomSlider";
import api from "../utils/axios";
import styles from "../styles/RoomDetails.module.css";
import Loader from "./Loader.jsx";
export default function RoomDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [room, setRoom] = useState(null);
  const [startDate, setStartDate] = useState("");
  const [user, setUser] = useState(null);
const [loading, setLoading] = useState(true);
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
    } finally {
      setLoading(false); // 🔥 important
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
       key: import.meta.env.VITE_RAZORPAY_KEY,
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


if (loading) return <Loader />;
if (!room) return <h2>Room not found</h2>;
  // ================= UI =================
//
return (
  <div className={styles.container}>
    
    {/* BACK */}
    <div className={styles.back} onClick={() => navigate(-1)}>
      ← Back to listings
    </div>

    <div className={styles.topSection}>

      {/* LEFT */}
      <div className={styles.left}>

        {/* IMAGE */}
        <RoomSlider
          images={
            Array.isArray(room?.images)
              ? room.images.map((img) => img?.url).filter(Boolean)
              : []
          }
        />

        {/* DETAILS CARD */}
        <div className={styles.detailsCard}>

          <h2 className={styles.title}>
            {room?.title}
          </h2>

          {/* LOCATION */}
          <p className={styles.location}>
            <i className="ri-map-pin-line"></i>
            {room?.location?.address}
          </p>

          {/* OWNER */}
          <div className={styles.owner}>
            <i className="ri-user-3-line"></i>
            <div>
              <span>Owner</span>
              <h4>{room?.owner?.name}</h4>
            </div>
          </div>

          {/* DESCRIPTION */}
          <div className={styles.section}>
            <h3>About this room</h3>
            <p>{room?.description}</p>
          </div>

        </div>
        {/* MAP SECTION */}
{/* MAP CARD (REAL MAP) */}
<div className={styles.mapCard}>

  <h3 className={styles.mapTitle}>
    <i className="ri-map-pin-line"></i> Location
  </h3>

  <iframe
    src={`https://www.google.com/maps?q=${room?.location?.lat},${room?.location?.lng}&z=15&output=embed`}
    className={styles.mapIframe}
    loading="lazy"
    title="Room Location"
  />

  <a
    href={`https://www.google.com/maps?q=${room?.location?.lat},${room?.location?.lng}`}
    target="_blank"
    rel="noopener noreferrer"
    className={styles.mapLink}
  >
    <span className={styles.red}><i class="ri-map-pin-4-fill"></i></span> Open in Google Maps
  </a>

</div>
      </div>

      {/* RIGHT */}
      <div className={styles.right}>
        <div className={styles.card}>

          <h2 className={styles.price}>
            ₹{room?.price} <span>/month</span>
          </h2>
<hr className={styles.divider} />
          <label>Booking Date</label>
          <input
            type="date"
            className={styles.input}
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />

          <button className={styles.payBtn} onClick={payNow}>
            Pay & Book Now
          </button>

          {/* CHAT */}
          {user &&
            room?.owner &&
            user._id?.toString() !== room.owner._id?.toString() && (
             <button
  className={styles.chatBtn}
  onClick={() => navigate(`/chatpage/${room.owner._id}`)}
>
  <i className="ri-chat-3-line"></i>
  <span>Chat with Owner</span>
</button>
            )}

          <p className={styles.note}>
            You won't be charged yet
          </p>

        </div>
      </div>

    </div>
  </div>
); 
}