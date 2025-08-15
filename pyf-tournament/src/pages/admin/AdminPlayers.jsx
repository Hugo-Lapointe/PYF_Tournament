import React, { useEffect, useState } from "react";
import { db } from "../../firebase";
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc } from "firebase/firestore";

export default function AdminPlayers() {
  const [players, setPlayers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [modalOpen, setModalOpen] = useState(false);

  // New player fields for the modal
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [discordName, setDiscordName] = useState("");
  const [gameName, setGameName] = useState("");
  const [valorantCurrentRank, setValorantCurrentRank] = useState("");
  const [valorantPeakRank, setValorantPeakRank] = useState("");
  const [imageFilename, setImageFilename] = useState("");

  // Expanded players accordion state
  const [expandedPlayers, setExpandedPlayers] = useState({});

  // Editing states keyed by player id
  const [editingPlayerId, setEditingPlayerId] = useState(null);
  const [editingPlayerData, setEditingPlayerData] = useState({});

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
      displayName: displayName.trim() || gameName.trim(),
      email: email.trim() || null,
      discordName: discordName.trim() || null,
      gameName: gameName.trim(),
      valorantCurrentRank: valorantCurrentRank.trim() || null,
      valorantPeakRank: valorantPeakRank.trim() || null,
      imageFilename: imageFilename.trim() || null,
    });

    setDisplayName("");
    setEmail("");
    setDiscordName("");
    setGameName("");
    setValorantCurrentRank("");
    setValorantPeakRank("");
    setImageFilename("");
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
    setExpandedPlayers((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const startEditing = (player) => {
    setEditingPlayerId(player.id);
    setEditingPlayerData({ ...player });
  };

  const cancelEditing = () => {
    setEditingPlayerId(null);
    setEditingPlayerData({});
  };

  const saveEditing = async () => {
    if (!editingPlayerData.gameName.trim()) {
      alert("Game Name is required");
      return;
    }

    try {
      const playerRef = doc(db, "players", editingPlayerId);
      await updateDoc(playerRef, editingPlayerData);
      setEditingPlayerId(null);
      setEditingPlayerData({});
      fetchPlayers();
    } catch (err) {
      console.error("Failed to update player:", err);
      alert("Error saving player. Check console for details.");
    }
  };

  const handleEditChange = (field, value) => {
    setEditingPlayerData((prev) => ({ ...prev, [field]: value }));
  };

  const filteredPlayers = players.filter((player) => {
    const term = searchTerm.toLowerCase();
    return (
      (player.gameName?.toLowerCase().includes(term) ?? false) ||
      (player.displayName?.toLowerCase().includes(term) ?? false) ||
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
        placeholder="Search by Display Name, Game Name, Email, or Discord"
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
            className="border rounded shadow bg-slate-800 overflow-hidden flex items-center"
          >
            <img
              src={`/images/phoques/${player.imageFilename}`}
              alt={player.displayName || player.gameName}
              className="w-32 h-32 object-contain rounded m-4"
            />
            <div className="flex-1 px-4 py-2">
              <button
                onClick={() => toggleExpand(player.id)}
                className="w-full text-left hover:bg-slate-700 px-2 py-1 rounded"
              >
                <span className="font-semibold text-xl text-white">
                  {player.displayName || player.gameName || "Unnamed Player"}
                </span>
              </button>

              {expandedPlayers[player.id] && (
                <div className="mt-2 text-gray-300 space-y-1">
                  {editingPlayerId === player.id ? (
                    <>
                      <input
                        type="text"
                        placeholder="Display Name"
                        value={editingPlayerData.displayName || ""}
                        onChange={(e) => handleEditChange("displayName", e.target.value)}
                        className="w-full p-2 border rounded bg-slate-900"
                      />
                      <input
                        type="email"
                        placeholder="Email"
                        value={editingPlayerData.email || ""}
                        onChange={(e) => handleEditChange("email", e.target.value)}
                        className="w-full p-2 border rounded bg-slate-900"
                      />
                      <input
                        type="text"
                        placeholder="Discord Name"
                        value={editingPlayerData.discordName || ""}
                        onChange={(e) => handleEditChange("discordName", e.target.value)}
                        className="w-full p-2 border rounded bg-slate-900"
                      />
                      <input
                        type="text"
                        placeholder="Game Name"
                        value={editingPlayerData.gameName || ""}
                        onChange={(e) => handleEditChange("gameName", e.target.value)}
                        className="w-full p-2 border rounded bg-slate-900"
                      />
                      <input
                        type="text"
                        placeholder="Current Rank"
                        value={editingPlayerData.valorantCurrentRank || ""}
                        onChange={(e) => handleEditChange("valorantCurrentRank", e.target.value)}
                        className="w-full p-2 border rounded bg-slate-900"
                      />
                      <input
                        type="text"
                        placeholder="Peak Rank"
                        value={editingPlayerData.valorantPeakRank || ""}
                        onChange={(e) => handleEditChange("valorantPeakRank", e.target.value)}
                        className="w-full p-2 border rounded bg-slate-900"
                      />
                      <input
                        type="text"
                        placeholder="Image Filename"
                        value={editingPlayerData.imageFilename || ""}
                        onChange={(e) => handleEditChange("imageFilename", e.target.value)}
                        className="w-full p-2 border rounded bg-slate-900"
                      />
                      <div className="flex space-x-3 mt-2">
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
                      <p><strong>Email:</strong> {player.email || "N/A"}</p>
                      <p><strong>Discord:</strong> {player.discordName || "N/A"}</p>
                      <p><strong>Game Name:</strong> {player.gameName}</p>
                      <p><strong>Current Rank:</strong> {player.valorantCurrentRank || "N/A"}</p>
                      <p><strong>Peak Rank:</strong> {player.valorantPeakRank || "N/A"}</p>
                      <div className="flex space-x-3 mt-2">
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
            </div>
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
                type="text"
                placeholder="Display Name"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="w-full p-2 border rounded"
              />
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
                placeholder="Current Rank"
                value={valorantCurrentRank}
                onChange={(e) => setValorantCurrentRank(e.target.value)}
                className="w-full p-2 border rounded"
              />
              <input
                type="text"
                placeholder="Peak Rank"
                value={valorantPeakRank}
                onChange={(e) => setValorantPeakRank(e.target.value)}
                className="w-full p-2 border rounded"
              />
              <input
                type="text"
                placeholder="Image Filename (e.g., Rapid.png)"
                value={imageFilename}
                onChange={(e) => setImageFilename(e.target.value)}
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
