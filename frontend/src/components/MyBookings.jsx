// import React, { useEffect, useState } from "react";

// export default function MyBookings() {
//   const [bookings, setBookings] = useState([]);

//   const user = JSON.parse(localStorage.getItem("user"));

//   useEffect(() => {
//     if (!user?._id) return; // ✅ guard

//    fetch("http://localhost:5000/api/bookings/my-bookings", {
//   credentials: "include",
// })
//       .then((res) => res.json())
//       .then((data) => {
//         if (data.success) setBookings(data.bookings);
//       })
//       .catch(console.error);
//   }, [user?._id]);

//   if (!user) return <h2>Please login to view bookings</h2>;

//   return (
//     <div>
//       <h2>My Bookings</h2>

//       {bookings.length === 0 && <p>No bookings found.</p>}

//       {bookings.map((b) => (
//         <div key={b._id} style={{ border: "1px solid #ccc", marginBottom: 10, padding: 10 }}>
//           <h3>{b.room.title}</h3>
//           <p>Rent: ₹{b.amount} / month</p>
//           <p>Start Date: {new Date(b.startDate).toDateString()}</p>
//           <p>Status: {b.status}</p>
//         </div>
//       ))}
//     </div>
//   );
// }

import React, { useEffect, useState } from "react";
import api from "../utils/axios";

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await api.get("/api/bookings/my-bookings");

        if (res.data.success) {
          setBookings(res.data.bookings);
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchBookings();
  }, []);

  return (
    <div>
      <h2>My Bookings</h2>

      {bookings.length === 0 && <p>No bookings found.</p>}

      {bookings.map((b) => (
        <div
          key={b._id}
          style={{
            border: "1px solid #ccc",
            marginBottom: 10,
            padding: 10,
          }}
        >
         <h3>{b.room?.title}</h3>
          <p>Rent: ₹{b.amount} / month</p>
          <p>Start Date: {new Date(b.startDate).toDateString()}</p>
          <p>Status: {b.status}</p>
        </div>
      ))}
    </div>
  );
}