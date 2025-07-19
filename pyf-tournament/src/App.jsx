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

import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <Router>
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
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/players"
          element={
            <ProtectedRoute>
              <AdminPlayers />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/teams"
          element={
            <ProtectedRoute>
              <AdminTeams />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/tournaments"
          element={
            <ProtectedRoute>
              <AdminTournaments />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/matches"
          element={
            <ProtectedRoute>
              <AdminMatches />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
