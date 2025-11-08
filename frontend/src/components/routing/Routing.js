import React from "react";
import { Routes, Route } from "react-router-dom";
import Tasks from "../Tasks/Tasks";
import PageNotFound from "../PageNotFound/PageNotFound";
import Landing from "../Landing/Landing";

export default function Routing() {
    return (
        <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/tasks" element={<Tasks />} />
            <Route path="*" element={<PageNotFound />} />
        </Routes>
    );
}