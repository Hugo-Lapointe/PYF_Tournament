import React from "react";
import { Link } from "react-router-dom";
import LogoutButton from "../../components/LogoutButton";

export default function AdminDashboard() {
  return (
    <div className="p-6 max-w-xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl">Admin Dashboard</h1>
        <LogoutButton />
      </div>
      <nav className="space-y-4">
        <Link
          to="/admin/players"
          className="block px-4 py-3 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Manage Players
        </Link>
        <Link
          to="/admin/teams"
          className="block px-4 py-3 bg-green-600 text-white rounded hover:bg-green-700"
        >
          Manage Teams
        </Link>
        <Link
          to="/admin/tournaments"
          className="block px-4 py-3 bg-purple-600 text-white rounded hover:bg-purple-700"
        >
          Manage Tournaments
        </Link>
        <Link
          to="/admin/matches"
          className="block px-4 py-3 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Submit Match Results
        </Link>
      </nav>
    </div>
  );
}
