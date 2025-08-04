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
  const [searchTerm, setSearchTerm] = useState("");
  const [modalOpen, setModalOpen] = useState(false);

  // New player fields for the modal
  const [email, setEmail] = useState("");
  const [discordName, setDiscordName] = useState("");
  const [gameName, setGameName] = useState("");
  const [valorantCurrentRank, setValorantCurrentRank] = useState("");
  const [valorantPeakRank, setValorantPeakRank] = useState("");

  // Expanded players accordion state
  const [expandedPlayers, setExpandedPlayers] = useState({});

  // Editing states keyed by player id
  // If editing, we keep the editable data here for that player
  const [editingPlayerId, setEditingPlayerId] = useState(null);
  const [editingPlayerData, setEditingPlayerData] = useState({});

  // Extra fields for editing players (stats)
  // We’ll keep them inside editingPlayerData so no separate state needed

  const fetchPlayers = async () => {
    const snapshot = await getDocs(collection(db, "players"));
    setPlayers(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
  };

  useEffect(() => {
    fetchPlayers();
  }, []);

  const addPlayer = async (e) => {
    e.preventDefault();

    if (!gameName.trim()) {
      alert("Game Name is required");
      return;
    }

    await addDoc(collection(db, "players"), {
      email: email.trim() || null,
      discordName: discordName.trim() || null,
      gameName: gameName.trim(),
      valorantCurrentRank: valorantCurrentRank.trim() || null,
      valorantPeakRank: valorantPeakRank.trim() || null,
      // Empty fields for stats on creation
      kda: null,
      headshotPercentage: null,
      currentTeam: null,
      previousTeams: [],
      tournamentHistory: [],
    });

    setEmail("");
    setDiscordName("");
    setGameName("");
    setValorantCurrentRank("");
    setValorantPeakRank("");
    setModalOpen(false);

    fetchPlayers();
  };

  const deletePlayer = async (id) => {
    if (window.confirm("Are you sure you want to delete this player?")) {
      await deleteDoc(doc(db, "players", id));
      fetchPlayers();
    }
  };

  const toggleExpand = (id) => {
    setExpandedPlayers((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // Start editing a player: copy data into editing state
  const startEditing = (player) => {
    setEditingPlayerId(player.id);
    setEditingPlayerData({
      email: player.email || "",
      discordName: player.discordName || "",
      gameName: player.gameName || "",
      valorantCurrentRank: player.valorantCurrentRank || "",
      valorantPeakRank: player.valorantPeakRank || "",
      kda: player.kda || "",
      headshotPercentage: player.headshotPercentage || "",
      currentTeam: player.currentTeam || "",
      previousTeams: player.previousTeams ? player.previousTeams.join(", ") : "",
      tournamentHistory: player.tournamentHistory
        ? player.tournamentHistory.map((th) => `${th.tournament} (${th.placing})`).join(", ")
        : "",
    });
  };

  // Cancel editing
  const cancelEditing = () => {
    setEditingPlayerId(null);
    setEditingPlayerData({});
  };

  // Save edited player data back to Firestore
  const saveEditing = async () => {
    if (!editingPlayerData.gameName.trim()) {
      alert("Game Name is required");
      return;
    }

    const playerRef = doc(db, "players", editingPlayerId);

    // Parse previous teams
    const previousTeamsArray = editingPlayerData.previousTeams
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    // Parse tournament history from string → array of objects
    const tournamentHistoryArray = editingPlayerData.tournamentHistory
      .split(",")
      .map((entry) => {
        const match = entry.trim().match(/^(.+?)\s*\((.+?)\)$/);
        if (match) {
          return {
            tournament: match[1].trim(),
            placing: match[2].trim(),
          };
        }
        return null;
      })
      .filter(Boolean);

    try {
      await updateDoc(playerRef, {
        email: editingPlayerData.email.trim() || null,
        discordName: editingPlayerData.discordName.trim() || null,
        gameName: editingPlayerData.gameName.trim(),
        valorantCurrentRank: editingPlayerData.valorantCurrentRank.trim() || null,
        valorantPeakRank: editingPlayerData.valorantPeakRank.trim() || null,
        kda: editingPlayerData.kda.trim() || null,
        headshotPercentage: editingPlayerData.headshotPercentage.trim() || null,
        currentTeam: editingPlayerData.currentTeam.trim() || null,
        previousTeams: previousTeamsArray,
        tournamentHistory: tournamentHistoryArray,
      });

      setEditingPlayerId(null);
      setEditingPlayerData({});
      fetchPlayers();
    } catch (err) {
      console.error("Failed to update player:", err);
      alert("Error saving player. Check console for details.");
    }
  };

  // Handle changes in the edit form
  const handleEditChange = (field, value) => {
    setEditingPlayerData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Filter players based on search term
  const filteredPlayers = players.filter((player) => {
    const term = searchTerm.toLowerCase();
    return (
      (player.gameName?.toLowerCase().includes(term) ?? false) ||
      (player.email?.toLowerCase().includes(term) ?? false) ||
      (player.discordName?.toLowerCase().includes(term) ?? false)
    );
  });

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h2 className="text-3xl mb-6 font-bold">Manage Players</h2>

      {/* Create Player Button */}
      <button
        onClick={() => setModalOpen(true)}
        className="mb-6 bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700 transition"
      >
        Create Player
      </button>

      {/* Search Bar */}
      <input
        type="search"
        placeholder="Search by Game Name, Email, or Discord"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mb-6 w-full border border-gray-400 p-2 rounded"
      />

      {/* Players List */}
      <ul className="space-y-4">
        {filteredPlayers.length === 0 && (
          <li className="text-center text-gray-400">No players found.</li>
        )}
        {filteredPlayers.map((player) => (
          <li
            key={player.id}
            className="border rounded shadow bg-slate-800 overflow-hidden"
          >
            <button
              onClick={() => toggleExpand(player.id)}
              className="w-full flex justify-between items-center px-4 py-3 text-left hover:bg-slate-700 focus:outline-none"
            >
              <span className="font-semibold text-lg">{player.gameName || "Unnamed Player"}</span>
              <span>{expandedPlayers[player.id] ? "▲" : "▼"}</span>
            </button>

            {expandedPlayers[player.id] && (
              <div className="px-4 pb-4 text-gray-300 space-y-2">
                {editingPlayerId === player.id ? (
                  <>
                    {/* Edit form */}
                    <div className="space-y-2">
                      <input
                        type="email"
                        placeholder="Email"
                        value={editingPlayerData.email}
                        onChange={(e) => handleEditChange("email", e.target.value)}
                        className="w-full p-2 border rounded bg-slate-900"
                      />
                      <input
                        type="text"
                        placeholder="Discord Name"
                        value={editingPlayerData.discordName}
                        onChange={(e) => handleEditChange("discordName", e.target.value)}
                        className="w-full p-2 border rounded bg-slate-900"
                      />
                      <input
                        type="text"
                        placeholder="Game Name *"
                        value={editingPlayerData.gameName}
                        onChange={(e) => handleEditChange("gameName", e.target.value)}
                        className="w-full p-2 border rounded bg-slate-900"
                        required
                      />
                      <input
                        type="text"
                        placeholder="Valorant Current Rank"
                        value={editingPlayerData.valorantCurrentRank}
                        onChange={(e) => handleEditChange("valorantCurrentRank", e.target.value)}
                        className="w-full p-2 border rounded bg-slate-900"
                      />
                      <input
                        type="text"
                        placeholder="Valorant Peak Rank"
                        value={editingPlayerData.valorantPeakRank}
                        onChange={(e) => handleEditChange("valorantPeakRank", e.target.value)}
                        className="w-full p-2 border rounded bg-slate-900"
                      />
                      <input
                        type="text"
                        placeholder="KDA"
                        value={editingPlayerData.kda}
                        onChange={(e) => handleEditChange("kda", e.target.value)}
                        className="w-full p-2 border rounded bg-slate-900"
                      />
                      <input
                        type="text"
                        placeholder="Headshot Percentage"
                        value={editingPlayerData.headshotPercentage}
                        onChange={(e) => handleEditChange("headshotPercentage", e.target.value)}
                        className="w-full p-2 border rounded bg-slate-900"
                      />
                      <input
                        type="text"
                        placeholder="Current Team"
                        value={editingPlayerData.currentTeam}
                        onChange={(e) => handleEditChange("currentTeam", e.target.value)}
                        className="w-full p-2 border rounded bg-slate-900"
                      />
                      <input
                        type="text"
                        placeholder="Previous Teams (comma separated)"
                        value={editingPlayerData.previousTeams}
                        onChange={(e) => handleEditChange("previousTeams", e.target.value)}
                        className="w-full p-2 border rounded bg-slate-900"
                      />
                      <input
                        type="text"
                        placeholder="Tournament History (e.g. 'Tournament A (1st), Tournament B (2nd)')"
                        value={editingPlayerData.tournamentHistory}
                        onChange={(e) => handleEditChange("tournamentHistory", e.target.value)}
                        className="w-full p-2 border rounded bg-slate-900"
                      />
                    </div>

                    <div className="flex space-x-4 mt-3">
                      <button
                        onClick={saveEditing}
                        className="bg-green-600 px-4 py-2 rounded hover:bg-green-700 text-white"
                      >
                        Save
                      </button>
                      <button
                        onClick={cancelEditing}
                        className="bg-gray-600 px-4 py-2 rounded hover:bg-gray-700 text-white"
                      >
                        Cancel
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    {/* Display player details */}
                    <p><strong>Email:</strong> {player.email || "N/A"}</p>
                    <p><strong>Discord:</strong> {player.discordName || "N/A"}</p>
                    <p><strong>Valorant Current Rank:</strong> {player.valorantCurrentRank || "N/A"}</p>
                    <p><strong>Valorant Peak Rank:</strong> {player.valorantPeakRank || "N/A"}</p>
                    <p><strong>KDA:</strong> {player.kda || "N/A"}</p>
                    <p><strong>Headshot Percentage:</strong> {player.headshotPercentage || "N/A"}</p>
                    <p><strong>Current Team:</strong> {player.currentTeam || "N/A"}</p>
                    <p><strong>Previous Teams:</strong> {player.previousTeams?.join(", ") || "N/A"}</p>
                    <p>
                      <strong>Tournament History:</strong>{" "}
                      {player.tournamentHistory && player.tournamentHistory.length > 0
                        ? player.tournamentHistory
                            .map((t) => `${t.tournament} (${t.placing})`)
                            .join(", ")
                        : "N/A"}
                    </p>

                    <div className="mt-3 flex space-x-4">
                      <button
                        onClick={() => startEditing(player)}
                        className="text-blue-500 hover:text-blue-700"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => deletePlayer(player.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        Delete
                      </button>
                    </div>
                  </>
                )}
              </div>
            )}
          </li>
        ))}
      </ul>

      {/* Modal for creating player */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-slate-900 rounded-lg p-6 w-full max-w-md shadow-lg relative">
            <h3 className="text-xl font-semibold mb-4">Create New Player</h3>

            <form onSubmit={addPlayer} className="space-y-3">
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-2 border rounded"
              />
              <input
                type="text"
                placeholder="Discord Name"
                value={discordName}
                onChange={(e) => setDiscordName(e.target.value)}
                className="w-full p-2 border rounded"
              />
              <input
                type="text"
                placeholder="Game Name *"
                value={gameName}
                onChange={(e) => setGameName(e.target.value)}
                className="w-full p-2 border rounded"
                required
              />
              <input
                type="text"
                placeholder="Valorant Current Rank"
                value={valorantCurrentRank}
                onChange={(e) => setValorantCurrentRank(e.target.value)}
                className="w-full p-2 border rounded"
              />
              <input
                type="text"
                placeholder="Valorant Peak Rank"
                value={valorantPeakRank}
                onChange={(e) => setValorantPeakRank(e.target.value)}
                className="w-full p-2 border rounded"
              />

              <div className="flex justify-end space-x-3 mt-4">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded bg-gray-700 hover:bg-gray-600 text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
