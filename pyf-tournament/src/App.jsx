import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Landing from "./pages/Landing";
import Apply from "./pages/Apply";
import Players from "./pages/Players";
import Standings from "./pages/Standings";

import AdminLogin from "./pages/AdminLogin";

import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminPlayers from "./pages/admin/AdminPlayers";
import AdminTeams from "./pages/admin/AdminTeams";
import AdminTournaments from "./pages/admin/AdminTournaments";
import AdminMatches from "./pages/admin/AdminMatches";

import ProtectedRoutes from "./components/ProtectedRoutes";
import Navbar from "./components/Navbar";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Landing />} />
        <Route path="/apply" element={<Apply />} />
        <Route path="/players" element={<Players />} />
        <Route path="/standings" element={<Standings />} />

        {/* Admin login */}
        <Route path="/admin-login" element={<AdminLogin />} />

        {/* Protected Admin Routes */}
        <Route
          path="/admin"
          element={
            <ProtectedRoutes>
              <AdminDashboard />
            </ProtectedRoutes>
          }
        />
        <Route
          path="/admin/players"
          element={
            <ProtectedRoutes>
              <AdminPlayers />
            </ProtectedRoutes>
          }
        />
        <Route
          path="/admin/teams"
          element={
            <ProtectedRoutes>
              <AdminTeams />
            </ProtectedRoutes>
          }
        />
        <Route
          path="/admin/tournaments"
          element={
            <ProtectedRoutes>
              <AdminTournaments />
            </ProtectedRoutes>
          }
        />
        <Route
          path="/admin/matches"
          element={
            <ProtectedRoutes>
              <AdminMatches />
            </ProtectedRoutes>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
