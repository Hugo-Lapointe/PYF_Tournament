import React, { useEffect, useState } from "react";
import Select from "react-select";
import { db } from "../../firebase";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";

export default function AdminTeams() {
  const [players, setPlayers] = useState([]);
  const [teams, setTeams] = useState([]);
  const [teamName, setTeamName] = useState("");
  const [selectedPlayers, setSelectedPlayers] = useState([]);

  // For editing
  const [editingId, setEditingId] = useState(null);

  // Fetch players on mount
  useEffect(() => {
    const fetchPlayers = async () => {
      const snap = await getDocs(collection(db, "players"));
      setPlayers(snap.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    };
    fetchPlayers();
  }, []);

  // Fetch teams on mount and after updates
  const fetchTeams = async () => {
    const snap = await getDocs(collection(db, "teams"));
    setTeams(snap.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
  };

  useEffect(() => {
    fetchTeams();
  }, []);

  // Add or Update team
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!teamName.trim() || selectedPlayers.length === 0) return;

    const playerIds = selectedPlayers.map((p) => p.value);

    if (editingId) {
      // Update existing team
      await updateDoc(doc(db, "teams", editingId), {
        name: teamName,
        players: playerIds,
      });
      setEditingId(null);
    } else {
      // Add new team
      await addDoc(collection(db, "teams"), {
        name: teamName,
        players: playerIds,
      });
    }
    setTeamName("");
    setSelectedPlayers([]);
    fetchTeams();
  };

  // Delete team
  const deleteTeam = async (id) => {
    if (
      window.confirm(
        "Are you sure you want to delete this team? This action cannot be undone."
      )
    ) {
      await deleteDoc(doc(db, "teams", id));
      if (editingId === id) {
        setEditingId(null);
        setTeamName("");
        setSelectedPlayers([]);
      }
      fetchTeams();
    }
  };

  // Start editing a team
  const startEditing = (team) => {
    setEditingId(team.id);
    setTeamName(team.name);
    // Map player IDs to react-select format
    const selected = team.players.map((pid) => {
      const player = players.find((p) => p.id === pid);
      return player ? { value: player.id, label: player.name } : null;
    }).filter(Boolean);
    setSelectedPlayers(selected);
  };

  // Cancel editing
  const cancelEditing = () => {
    setEditingId(null);
    setTeamName("");
    setSelectedPlayers([]);
  };

  const playerOptions = players.map((p) => ({
    value: p.id,
    label: p.name,
  }));

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl mb-4">{editingId ? "Edit Team" : "Create Team"}</h2>
      <form onSubmit={handleSubmit} className="space-y-4 mb-6">
        <input
          className="border p-2 rounded w-full"
          placeholder="Team Name"
          value={teamName}
          onChange={(e) => setTeamName(e.target.value)}
        />
        <Select
          isMulti
          options={playerOptions}
          value={selectedPlayers}
          onChange={setSelectedPlayers}
          placeholder="Select Players"
        />
        <div className="space-x-4">
          <button
            type="submit"
            className={`px-4 py-2 rounded text-white ${
              editingId ? "bg-yellow-600 hover:bg-yellow-700" : "bg-green-600 hover:bg-green-700"
            }`}
          >
            {editingId ? "Save Changes" : "Create Team"}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={cancelEditing}
              className="px-4 py-2 rounded bg-gray-400 hover:bg-gray-500 text-white"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      <h3 className="text-xl mb-3">Teams List</h3>
      <ul className="space-y-3">
        {teams.map((team) => (
          <li
            key={team.id}
            className="border p-3 rounded flex justify-between items-center"
          >
            <div>
              <strong>{team.name}</strong>
              <p className="text-sm text-gray-600">
                Players:{" "}
                {team.players
                  .map((pid) => players.find((p) => p.id === pid)?.name)
                  .filter(Boolean)
                  .join(", ") || "No players"}
              </p>
            </div>
            <div className="space-x-2">
              <button
                onClick={() => startEditing(team)}
                className="text-yellow-600 hover:text-yellow-800"
              >
                Edit
              </button>
              <button
                onClick={() => deleteTeam(team.id)}
                className="text-red-600 hover:text-red-800"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
