// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { useParams, useNavigate } from "react-router-dom";

// export default function EditRoom() {
//   const { id } = useParams();
//   const navigate = useNavigate();

//   const [data, setData] = useState({
//     title: "",
//     description: "",
//     price: "",
//     address: "",
//     lat: "",
//     lng: "",
//   });

//   const [images, setImages] = useState([]);
//   const [newImages, setNewImages] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [submitting, setSubmitting] = useState(false);

//   /* ---------------- GET ROOM DATA ---------------- */
//   useEffect(() => {
//     fetchRoom();
//     // eslint-disable-next-line
//   }, [id]);

//   const fetchRoom = async () => {
//     try {
//       setLoading(true);
//       const res = await axios.get(`http://localhost:5000/api/rooms/${id}`);

//       if (res.data.success) {
//         const room = res.data.room;

//         setData({
//           title: room.title || "",
//           description: room.description || "",
//           price: room.price || "",
//           address: room.location?.address || "",
//           lat: room.location?.lat || "",
//           lng: room.location?.lng || "",
//         });

//         setImages(room.images || []);
//       }
//     } catch (err) {
//       console.error("Fetch room error:", err);
//       alert("Failed to load room");
//     } finally {
//       setLoading(false);
//     }
//   };

//   /* ---------------- USE MY LOCATION ---------------- */
//   const getMyLocation = () => {
//     if (!navigator.geolocation) {
//       alert("Geolocation not supported");
//       return;
//     }

//     navigator.geolocation.getCurrentPosition(
//       (position) => {
//         setData((prev) => ({
//           ...prev,
//           lat: position.coords.latitude,
//           lng: position.coords.longitude,
//         }));
//       },
//       () => {
//         alert("Location permission denied");
//       }
//     );
//   };

//   /* ---------------- HANDLE CHANGE ---------------- */
//   const handleChange = (e) => {
//     setData({ ...data, [e.target.name]: e.target.value });
//   };

//   /* ---------------- SUBMIT ---------------- */
//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!data.lat || !data.lng) {
//       alert("Please use 'Use My Location'");
//       return;
//     }

//     try {
//       setSubmitting(true);

//       const formData = new FormData();
//       Object.keys(data).forEach((key) => {
//         formData.append(key, data[key]);
//       });

//       if (newImages.length > 0) {
//         for (let i = 0; i < newImages.length; i++) {
//           formData.append("images", newImages[i]);
//         }
//       }

//     const res = await axios.put(
//   `http://localhost:5000/api/rooms/edit/${id}`,
//   formData,
//   {
//     withCredentials: true, // 🔥
//   }
// );

//       if (res.data.success) {
//         alert("Room updated successfully!");
//         navigate("/my-rooms");
//       }
//     } catch (err) {
//       console.error("Update error:", err);
//       alert("Update failed");
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   if (loading) return <h2>Loading...</h2>;

//   /* ---------------- UI ---------------- */
//   return (
//     <form onSubmit={handleSubmit}>
//       <h2>Edit Room</h2>

//       <input
//         name="title"
//         value={data.title}
//         onChange={handleChange}
//         placeholder="Title"
//         required
//       />

//       <textarea
//         name="description"
//         value={data.description}
//         onChange={handleChange}
//         placeholder="Description"
//         required
//       />

//       <input
//         name="price"
//         type="number"
//         value={data.price}
//         onChange={handleChange}
//         placeholder="Price"
//         required
//       />

//       <input
//         name="address"
//         value={data.address}
//         onChange={handleChange}
//         placeholder="Address"
//         required
//       />

//       <input
//         name="lat"
//         value={data.lat}
//         onChange={handleChange}
//         placeholder="Latitude"
//         required
//       />

//       <input
//         name="lng"
//         value={data.lng}
//         onChange={handleChange}
//         placeholder="Longitude"
//         required
//       />

//       <button type="button" onClick={getMyLocation}>
//         📍 Use My Location
//       </button>

//       <div>
//         <h4>Existing Images</h4>
//         {images.map((img, i) => (
//           <img key={i} src={img.url || img} alt="" width={120} />
//         ))}
//       </div>

//       <input
//         type="file"
//         multiple
//         onChange={(e) => setNewImages(e.target.files)}
//       />

//       <button type="submit" disabled={submitting}>
//         {submitting ? "Updating..." : "Update Room"}
//       </button>
//     </form>
//   );
// }


import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../utils/axios";

export default function EditRoom() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [data, setData] = useState({
    title: "",
    description: "",
    price: "",
    address: "",
    lat: "",
    lng: "",
  });

  const [images, setImages] = useState([]);
  const [newImages, setNewImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // ================= FETCH ROOM =================
  useEffect(() => {
    const fetchRoom = async () => {
      try {
        const res = await api.get(`/api/rooms/${id}`);

        if (res.data.success) {
          const room = res.data.room;

          setData({
            title: room.title || "",
            description: room.description || "",
            price: room.price || "",
            address: room.location?.address || "",
            lat: room.location?.lat || "",
            lng: room.location?.lng || "",
          });

          setImages(room.images || []);
        }
      } catch (err) {
        console.error("Fetch room error:", err);
        alert("Failed to load room");
      } finally {
        setLoading(false);
      }
    };

    fetchRoom();
  }, [id]);

  // ================= LOCATION =================
  const getMyLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation not supported");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setData((prev) => ({
          ...prev,
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        }));
      },
      () => alert("Location permission denied")
    );
  };

  // ================= INPUT =================
  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  // ================= SUBMIT =================
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!data.lat || !data.lng) {
      alert("Please use 'Use My Location'");
      return;
    }

    try {
      setSubmitting(true);

      const formData = new FormData();

      Object.keys(data).forEach((key) => {
        formData.append(key, data[key]);
      });

      for (let i = 0; i < newImages.length; i++) {
        formData.append("images", newImages[i]);
      }

      const res = await api.put(`/api/rooms/edit/${id}`, formData);

      if (res.data.success) {
        alert("Room updated successfully!");
        navigate("/my-rooms");
      }
    } catch (err) {
      console.error("Update error:", err);
      alert("Update failed");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <h2>Loading...</h2>;

  // ================= UI =================
  return (
    <form onSubmit={handleSubmit}>
      <h2>Edit Room</h2>

      <input
        name="title"
        value={data.title}
        onChange={handleChange}
        placeholder="Title"
        required
      />

      <textarea
        name="description"
        value={data.description}
        onChange={handleChange}
        placeholder="Description"
        required
      />

      <input
        name="price"
        type="number"
        value={data.price}
        onChange={handleChange}
        placeholder="Price"
        required
      />

      <input
        name="address"
        value={data.address}
        onChange={handleChange}
        placeholder="Address"
        required
      />

      <input
        name="lat"
        value={data.lat}
        onChange={handleChange}
        placeholder="Latitude"
        required
      />

      <input
        name="lng"
        value={data.lng}
        onChange={handleChange}
        placeholder="Longitude"
        required
      />

      <button type="button" onClick={getMyLocation}>
        📍 Use My Location
      </button>

      <div>
        <h4>Existing Images</h4>
        {images.map((img, i) => (
          <img key={i} src={img.url} alt="" width={120} />
        ))}
      </div>

      <input
        type="file"
        multiple
        onChange={(e) => setNewImages(e.target.files)}
      />

      <button type="submit" disabled={submitting}>
        {submitting ? "Updating..." : "Update Room"}
      </button>
    </form>
  );
}