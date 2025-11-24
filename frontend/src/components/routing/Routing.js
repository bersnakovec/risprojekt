import React from "react";
import { Routes, Route } from "react-router-dom";
import Tasks from "../Tasks/Tasks";
import PageNotFound from "../PageNotFound/PageNotFound";
import Landing from "../Landing/Landing";
import Login from "../Login/Login";
import Register from "../Register/Register";
import ProtectedRoute from "./ProtectedRoute";

export default function Routing() {
    return (
        <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/" element={<ProtectedRoute><Landing /></ProtectedRoute>} />
            <Route path="/tasks" element={<ProtectedRoute><Tasks /></ProtectedRoute>} />
            <Route path="*" element={<PageNotFound />} />
        </Routes>
    );
}