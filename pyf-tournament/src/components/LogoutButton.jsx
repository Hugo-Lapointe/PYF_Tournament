import React from "react";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";

export default function LogoutButton() {
  const navigate = useNavigate();

  const logout = async () => {
    await auth.signOut();
    navigate("/admin-login");
  };

  return (
    <button
      onClick={logout}
      className="bg-gray-600 text-white px-3 py-1 rounded hover:bg-gray-700"
    >
      Logout
    </button>
  );
}
