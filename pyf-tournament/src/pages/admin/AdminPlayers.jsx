import React, { useEffect, useState } from "react";
import { db } from "../../firebase";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";

export default function AdminPlayers() {
  const [players, setPlayers] = useState([]);
  const [playerName, setPlayerName] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editingName, setEditingName] = useState("");

  // Fetch players
  const fetchPlayers = async () => {
    const snapshot = await getDocs(collection(db, "players"));
    setPlayers(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
  };

  // Add player
  const addPlayer = async (e) => {
    e.preventDefault();
    if (!playerName.trim()) return;
    await addDoc(collection(db, "players"), { name: playerName });
    setPlayerName("");
    fetchPlayers();
  };

  // Delete player
  const deletePlayer = async (id) => {
    await deleteDoc(doc(db, "players", id));
    fetchPlayers();
  };

  // Start editing
  const startEditing = (player) => {
    setEditingId(player.id);
    setEditingName(player.name);
  };

  // Save edit
  const saveEdit = async () => {
    if (!editingName.trim()) return;
    await updateDoc(doc(db, "players", editingId), { name: editingName });
    setEditingId(null);
    setEditingName("");
    fetchPlayers();
  };

  useEffect(() => {
    fetchPlayers();
  }, []);

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h2 className="text-2xl mb-4">Manage Players</h2>

      {/* Add Form */}
      <form onSubmit={addPlayer} className="mb-6">
        <input
          type="text"
          placeholder="Player Name"
          value={playerName}
          onChange={(e) => setPlayerName(e.target.value)}
          className="border p-2 rounded mr-2"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Add Player
        </button>
      </form>

      {/* Players List */}
      <ul className="space-y-2">
        {players.map((player) => (
          <li
            key={player.id}
            className="flex justify-between items-center border p-2 rounded"
          >
            {editingId === player.id ? (
              <>
                <input
                  type="text"
                  value={editingName}
                  onChange={(e) => setEditingName(e.target.value)}
                  className="border p-1 mr-2 rounded w-full"
                />
                <div className="space-x-2">
                  <button
                    onClick={saveEdit}
                    className="text-green-600 hover:text-green-800"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setEditingId(null)}
                    className="text-gray-600 hover:text-gray-800"
                  >
                    Cancel
                  </button>
                </div>
              </>
            ) : (
              <>
                <span>{player.name}</span>
                <div className="space-x-2">
                  <button
                    onClick={() => startEditing(player)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deletePlayer(player.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    Delete
                  </button>
                </div>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
