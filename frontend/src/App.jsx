import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import RoomsPage from "./components/RoomsPage";
import AddRoom from "./components/AddRoom";
import RoomDetails from "./components/RoomDetails";

import MyRooms from "./components/MyRooms";
import EditRoom from "./components/EditRoom";
import Navbar from "./components/Navbar";
import MyBookings from "./components/MyBookings";

import ProtectedRoute from "./components/ProtectedRoute";
import PublicRoute from "./components/PublicRoute";
import ChatPage from "./components/ChatPage";
import GoogleSuccess from "./components/GoogleSuccess";

import Favorites from "./components/Favourites";

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
       <Route
  path="/login"
  element={
    <PublicRoute>
      <Login />
    </PublicRoute>
  }
/>
<Route path="/google-success" element={<GoogleSuccess/>} />
        <Route path="/" element={<RoomsPage />} />
        <Route
          path="/add"
          element={
            <ProtectedRoute>
              <AddRoom />
            </ProtectedRoute>
          }
        />
        <Route path="/room/:id" element={<RoomDetails />} />
       <Route
          path="/my-rooms"
          element={
            <ProtectedRoute>
              <MyRooms />
            </ProtectedRoute>
          }
        />
         <Route
          path="/edit/:id"
          element={
            <ProtectedRoute>
              <EditRoom />
            </ProtectedRoute>
          }
        />

        <Route
  path="/my-bookings"
  element={
    <ProtectedRoute>
      <MyBookings />
    </ProtectedRoute>
  }
/>
        {/* <Route path="/chatpage" element={<ChatPage />} /> */}
   <Route
  path="/chatpage"
  element={
    <ProtectedRoute>
      <ChatPage />
    </ProtectedRoute>
  }
/>
   <Route
  path="/chatpage/:userId"
  element={
    <ProtectedRoute>
      <ChatPage />
    </ProtectedRoute>
  }
/>
               
 <Route
      path="/favorites"
      element={
        <ProtectedRoute>
          <Favorites/>
        </ProtectedRoute>
      }
    />
      </Routes>
      {/* <Route path="/likedRooms" element={<LikedRooms/>}/> */}
    </BrowserRouter>
  );
}
