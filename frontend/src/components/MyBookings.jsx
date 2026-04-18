// import React, { useEffect, useState } from "react";
// import api from "../utils/axios";
// import styles from "../styles/MyBookings.module.css";
// import { useNavigate } from "react-router-dom";

// export default function MyBookings() {
//   const [bookings, setBookings] = useState([]);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchBookings = async () => {
//       try {
//         const res = await api.get("/api/bookings/my-bookings");

//         if (res.data.success) {
//           setBookings(res.data.bookings);
//         }
//       } catch (err) {
//         console.error(err);
//       }
//     };

//     fetchBookings();
//   }, []);

//   return (
//     <div className={styles.container}>
//       <h1 className={styles.heading}>My Bookings</h1>
//       <p className={styles.subHeading}>
//         Manage and view all your room bookings
//       </p>

//       {bookings.length === 0 && (
//         <p className={styles.empty}>No bookings found.</p>
//       )}

//       {bookings.map((b) => (
//         <div key={b._id} className={styles.card}>
          
//           {/* IMAGE */}
//           <img
//             src={b.room?.images?.[0]?.url}
//             alt="room"
//             className={styles.image}
//           />

//           {/* CONTENT */}
//           <div className={styles.content}>
//             <h2>{b.room?.title}</h2>

//             <p className={styles.location}>
//               <i class="ri-gps-line"></i> {b.room?.location?.address}
//             </p>

//             <p className={styles.owner}>
//             <i class="ri-user-line"></i> Owner: {b.room?.owner?.name}
//             </p>

//             <hr />

//             <p className={styles.date}>
//             <i class="ri-calendar-2-line"></i>Booking Date:{" "}
//              <span className={styles.bookingdate}> {new Date(b.startDate).toDateString()}</span>
//             </p>

//             <p className={styles.price}>
//               ₹ {b.amount} <span>/month</span>
//             </p>
//           </div>

//           {/* BUTTON */}
//           <div className={styles.action}>
//             <button
//               onClick={() => navigate(`/room/${b.room?._id}`)}
//               className={styles.btn}
//             >
//               View Details
//             </button>
//           </div>
//         </div>
//       ))}
//     </div>
//   );
// }
import React, { useEffect, useState } from "react";
import api from "../utils/axios";
import styles from "../styles/MyBookings.module.css";
import { useNavigate } from "react-router-dom";
import Loader from "./Loader.jsx"; 
export default function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const navigate = useNavigate();
const [loading, setLoading] = useState(true);
useEffect(() => {
  const fetchBookings = async () => {
    try {
      const res = await api.get("/api/bookings/my-bookings");

      if (res.data.success) {
        setBookings(res.data.bookings);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false); // 🔥 important
    }
  };

  fetchBookings();
}, []);
if (loading) return <Loader />;
  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>My Bookings</h1>
      <p className={styles.subHeading}>
        Manage and view all your room bookings
      </p>

      {bookings.length === 0 && (
        <p className={styles.empty}>No bookings found.</p>
      )}

      {bookings.map((b) => (
        <div key={b._id} className={styles.card}>
          
          {/* IMAGE */}
          <img
            src={b.room?.images?.[0]?.url}
            alt="room"
            className={styles.image}
          />

          {/* CONTENT */}
          <div className={styles.content}>
            <h2>{b.room?.title}</h2>

            <p className={styles.location}>
              <i className="ri-gps-line"></i> {b.room?.location?.address}
            </p>

            <p className={styles.owner}>
            <i className="ri-user-line"></i> Owner: {b.room?.owner?.name}
            </p>

            <hr />

            <p className={styles.date}>
            <i className="ri-calendar-2-line"></i>Booking Date:{" "}
             <span className={styles.bookingdate}> {new Date(b.startDate).toDateString()}</span>
            </p>

            <p className={styles.price}>
              ₹ {b.amount} <span>/month</span>
            </p>
          </div>

          {/* BUTTON */}
          <div className={styles.action}>
            <button
              onClick={() => navigate(`/room/${b.room?._id}`)}
              className={styles.btn}
            >
              View Details
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}