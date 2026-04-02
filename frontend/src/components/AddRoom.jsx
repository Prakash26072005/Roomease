// import React, { useState } from "react";
// import {  useNavigate } from "react-router-dom";
// import api from "../utils/axios";
// export default function AddRoom() {
// const [data, setData] = useState({
//   title: "",
//   description: "",
//   price: "",
//   address: "",
//   lat: "",
//   lng: ""
// });

// const getMyLocation = () => {
//   if (!navigator.geolocation) {
//     alert("Geolocation is not supported by your browser");
//     return;
//   }

//   navigator.geolocation.getCurrentPosition(
//     (position) => {
//       setData((prev) => ({
//         ...prev,
//         lat: position.coords.latitude,
//         lng: position.coords.longitude,
//       }));
//     },
//     (err) => {
//       alert("Location permission denied");
//     }
//   );
// };


//   const [images, setImages] = useState([]);
//     const navigate = useNavigate();

//   const handleChange = (e) => {
//     setData({ ...data, [e.target.name]: e.target.value });
//   };

//   const handleImages = (e) => {
//     setImages(e.target.files);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//       // Basic validation
//     if (!data.lat || !data.lng) {
//       alert("Please click 'Use My Location' to get latitude & longitude");
//       return;
//     }

   
//     const formData = new FormData();

//     Object.keys(data).forEach(key => {
//       formData.append(key, data[key]);
//     });

//     for (let i = 0; i < images.length; i++) {
//       formData.append("images", images[i]);
//     }
// const res = await fetch("http://localhost:5000/api/rooms/add", {
//   method: "POST",
//   credentials: "include", // 🔥 cookie auto send
//   body: formData,
// });

//     const result = await res.json();
//     console.log(result);

//     if (result.success) {
//       alert("Room added successfully!");
//         navigate("/my-rooms");
//     }
//   };

//   return (
//     <form onSubmit={handleSubmit}>
//       <input name="title" placeholder="Title" onChange={handleChange} required />
//       <input name="description" placeholder="Description" onChange={handleChange} required />
//       <input name="price" placeholder="Price" type="number" onChange={handleChange} required />
//       <input
//   name="address"
//    placeholder="address"
//   onChange={handleChange}
//   required
// />

// <input
//   name="lat"
//   placeholder="Latitude (e.g. 23.7879)"
//   onChange={handleChange}
//   value={data.lat}
//   required
// />

// <input
//   name="lng"
//   placeholder="Longitude (e.g. 84.444)"
//   onChange={handleChange}
//   value={data.lng}
//   required
// />
// <button type="button" onClick={getMyLocation}>
//   📍 Use My Location
// </button>

//       <input type="file" multiple onChange={handleImages} />

//       <button type="submit">Add Room</button>
//     </form>
//   );
// }


import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/axios";

export default function AddRoom() {
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

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleImages = (e) => {
    setImages(e.target.files);
  };

  // 📍 AUTO LOCATION
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
      () => {
        alert("Location permission denied");
      }
    );
  };

  // 🚀 SUBMIT
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!data.lat || !data.lng) {
      alert("Please click 'Use My Location'");
      return;
    }

    try {
      const formData = new FormData();

      Object.keys(data).forEach((key) => {
        formData.append(key, data[key]);
      });

      for (let i = 0; i < images.length; i++) {
        formData.append("images", images[i]);
      }

      const res = await api.post("/api/rooms/add", formData);

      if (res.data.success) {
        alert("Room added successfully!");
        navigate("/my-rooms");
      }
    } catch (err) {
      console.error(err);
      alert("Failed to add room");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Add Room</h2>

      <input name="title" placeholder="Title" onChange={handleChange} required />

      <input name="description" placeholder="Description" onChange={handleChange} required />

      <input name="price" type="number" placeholder="Price" onChange={handleChange} required />

      <input name="address" placeholder="Address" onChange={handleChange} required />

      <input
        name="lat"
        placeholder="Latitude"
        value={data.lat}
        onChange={handleChange}
        required
      />

      <input
        name="lng"
        placeholder="Longitude"
        value={data.lng}
        onChange={handleChange}
        required
      />

      <button type="button" onClick={getMyLocation}>
        📍 Use My Location
      </button>

      <input type="file" multiple onChange={handleImages} />

      <button type="submit">Add Room</button>
    </form>
  );
}