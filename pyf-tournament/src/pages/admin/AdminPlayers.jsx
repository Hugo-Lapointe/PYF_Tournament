import React, { useEffect, useState } from "react";
import { db } from "../../firebase";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
} from "firebase/firestore";

export default function AdminPlayers() {
  const [players, setPlayers] = useState([]);
  const [playerName, setPlayerName] = useState("");

  // Fetch players from Firestore
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

  useEffect(() => {
    fetchPlayers();
  }, []);

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h2 className="text-2xl mb-4">Manage Players</h2>
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

      <ul className="space-y-2">
        {players.map((player) => (
          <li
            key={player.id}
            className="flex justify-between items-center border p-2 rounded"
          >
            <span>{player.name}</span>
            <button
              onClick={() => deletePlayer(player.id)}
              className="text-red-600 hover:text-red-800"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
