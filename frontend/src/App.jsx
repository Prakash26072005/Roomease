import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import RoomsPage from "./components/RoomsPage";
import AddRoom from "./components/AddRoom";
import RoomDetails from "./components/RoomDetails";
import Navbar from "./components/navbar";
import MyRooms from "./components/MyRooms";
import EditRoom from "./components/EditRoom";

export default function App() {
  return (
    <BrowserRouter>
    <Navbar/>
      <Routes>
          <Route path="/login" element={<Login />} />
        <Route path="/" element={<RoomsPage />} />
        <Route path="/add" element={<AddRoom />} />
        <Route path="/room/:id" element={<RoomDetails />} />
        <Route path="/my-rooms" element={<MyRooms />} />
        <Route path="/edit/:id" element={<EditRoom />} />
      </Routes>
    </BrowserRouter>
  );
}