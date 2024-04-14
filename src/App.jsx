import React from "react";
import PrivateRoutes from "./Components/PrivateRoutes";
import { AuthProvider } from "./Context/AuthContext";
import Room from "./Pages/Room";
import Login from "./Pages/Login";
import Register from "./Pages/Register";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />}></Route>
          <Route path="/register" element={<Register />}></Route>

          <Route element={<PrivateRoutes />}>
            <Route path="/" element={<Room />}></Route>
          </Route>
        </Routes>
      </AuthProvider>
    </Router>
  );
}
