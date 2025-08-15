import React, { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  doc,
  deleteDoc,
} from "firebase/firestore";
import { db } from "../../firebase";

export default function AdminTeams() {
  const [teams, setTeams] = useState([]);
  const [players, setPlayers] = useState([]);
  const [playersMap, setPlayersMap] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [teamName, setTeamName] = useState("");
  const [logoFilename, setLogoFilename] = useState("");
  const [selectedPlayerIds, setSelectedPlayerIds] = useState([]);
  const [captainId, setCaptainId] = useState(""); // New: captain
  const [playerSearch, setPlayerSearch] = useState("");
  const [editingTeamId, setEditingTeamId] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const teamSnapshot = await getDocs(collection(db, "teams"));
    const fetchedTeams = teamSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setTeams(fetchedTeams);

    const playerSnapshot = await getDocs(collection(db, "players"));
    const fetchedPlayers = playerSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setPlayers(fetchedPlayers);

    const map = {};
    fetchedPlayers.forEach((p) => (map[p.id] = p));
    setPlayersMap(map);
  };

  const handleDeleteTeam = async (teamId) => {
    if (!window.confirm("Are you sure you want to delete this team?")) return;
    await deleteDoc(doc(db, "teams", teamId));

    const team = teams.find((t) => t.id === teamId);
    if (team?.players) {
      for (const playerId of team.players) {
        await updateDoc(doc(db, "players", playerId), { currentTeam: null });
      }
    }

    setTeams((prev) => prev.filter((team) => team.id !== teamId));
  };

  const handleCreateOrEditTeam = async () => {
    if (!teamName.trim() || selectedPlayerIds.length === 0) return;

    const teamData = {
      name: teamName.trim(),
      players: selectedPlayerIds,
      logoFilename: logoFilename.trim(),
      captainId: captainId || null, // Save captain
    };

    if (editingTeamId) {
      const teamRef = doc(db, "teams", editingTeamId);
      await updateDoc(teamRef, teamData);

      const prevTeam = teams.find((t) => t.id === editingTeamId);
      const prevPlayerIds = prevTeam?.players || [];

      for (const playerId of prevPlayerIds.filter((id) => !selectedPlayerIds.includes(id))) {
        await updateDoc(doc(db, "players", playerId), { currentTeam: null });
      }

      for (const playerId of selectedPlayerIds) {
        await updateDoc(doc(db, "players", playerId), { currentTeam: editingTeamId });
      }
    } else {
      const newTeamRef = await addDoc(collection(db, "teams"), teamData);

      for (const playerId of selectedPlayerIds) {
        await updateDoc(doc(db, "players", playerId), { currentTeam: newTeamRef.id });
      }
    }

    setTeamName("");
    setLogoFilename("");
    setSelectedPlayerIds([]);
    setCaptainId("");
    setPlayerSearch("");
    setEditingTeamId(null);
    setShowModal(false);

    fetchData();
  };

  const handleTogglePlayer = (playerId) => {
    setSelectedPlayerIds((prev) =>
      prev.includes(playerId)
        ? prev.filter((id) => id !== playerId)
        : [...prev, playerId]
    );
    // If deselecting captain, clear captainId
    if (playerId === captainId) setCaptainId("");
  };

  const handleEditTeam = (team) => {
    setEditingTeamId(team.id);
    setTeamName(team.name);
    setLogoFilename(team.logoFilename || "");
    setSelectedPlayerIds(team.players || []);
    setCaptainId(team.captainId || "");
    setPlayerSearch("");
    setShowModal(true);
  };

  const filteredPlayers = players.filter((player) =>
    player.gameName.toLowerCase().includes(playerSearch.toLowerCase())
  );

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Teams</h1>
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Create Team
        </button>
      </div>

      {teams.length === 0 ? (
        <p>No teams yet.</p>
      ) : (
        <div className="space-y-4">
          {teams.map((team) => (
            <div key={team.id} className="border rounded p-4 shadow-sm bg-slate-800">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-4">
                  {team.logoFilename && (
                    <img
                      src={`/images/team-logos/${team.logoFilename}`}
                      alt={team.name}
                      className="w-12 h-12 object-contain"
                    />
                  )}
                  <h2 className="text-lg font-semibold">{team.name}</h2>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEditTeam(team)}
                    className="text-yellow-400 hover:text-yellow-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteTeam(team.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    Delete
                  </button>
                </div>
              </div>
              <p className="text-sm text-gray-500 mb-2">
                Players ({team.players?.length || 0}):
              </p>
              <ul className="list-disc list-inside text-white">
                {team.players?.map((playerId) => {
                  const player = playersMap[playerId];
                  return (
                    <li key={playerId}>
                      {player?.gameName || "Unknown Player"}{" "}
                      {player?.valorantCurrentRank ? `(${player.valorantCurrentRank})` : ""}
                      {playerId === team.captainId ? " (Captain)" : ""}
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-slate-900 p-6 rounded-md shadow-md w-full max-w-md text-white">
            <h2 className="text-xl font-semibold mb-4">
              {editingTeamId ? "Edit Team" : "Create New Team"}
            </h2>
            <input
              type="text"
              placeholder="Team name"
              className="w-full border rounded px-3 py-2 mb-4 text-white"
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
            />
            <input
              type="text"
              placeholder="Logo filename (e.g., team1.png)"
              className="w-full border rounded px-3 py-2 mb-4 text-white"
              value={logoFilename}
              onChange={(e) => setLogoFilename(e.target.value)}
            />
            <input
              type="text"
              placeholder="Search players..."
              className="w-full border rounded px-3 py-2 mb-2 text-white"
              value={playerSearch}
              onChange={(e) => setPlayerSearch(e.target.value)}
            />

            <div className="mb-4 max-h-48 overflow-y-auto border p-2 rounded">
              <p className="font-medium mb-2 text-white">Select Players:</p>
              {filteredPlayers.length === 0 ? (
                <p className="text-gray-400">No players found.</p>
              ) : (
                filteredPlayers.map((player) => (
                  <label
                    key={player.id}
                    className="block cursor-pointer select-none text-white"
                  >
                    <input
                      type="checkbox"
                      className="mr-2"
                      checked={selectedPlayerIds.includes(player.id)}
                      onChange={() => handleTogglePlayer(player.id)}
                    />
                    {player.gameName}{" "}
                    {player.valorantCurrentRank && `(${player.valorantCurrentRank})`}
                  </label>
                ))
              )}
            </div>

            {selectedPlayerIds.length > 0 && (
              <div className="mb-4">
                <p className="font-medium mb-2 text-white">Select Captain:</p>
                <select
                  className="w-full border rounded px-3 py-2 text-white bg-slate-700"
                  value={captainId}
                  onChange={(e) => setCaptainId(e.target.value)}
                >
                  <option value="">-- None --</option>
                  {selectedPlayerIds.map((id) => {
                    const player = playersMap[id];
                    return (
                      <option key={id} value={id}>
                        {player?.gameName || "Unknown Player"}
                      </option>
                    );
                  })}
                </select>
              </div>
            )}

            {selectedPlayerIds.length > 0 && (
              <div className="mb-4 border-t border-gray-700 pt-2">
                <p className="font-semibold mb-2">Selected Players:</p>
                <ul className="list-disc list-inside max-h-32 overflow-y-auto text-white">
                  {selectedPlayerIds.map((id) => {
                    const player = playersMap[id];
                    return (
                      <li key={id}>
                        {player?.gameName + " (" + player?.valorantCurrentRank + ")" ||
                          "Unknown Player"}
                        {id === captainId ? " (Captain)" : ""}
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}

            <div className="flex justify-end space-x-2">
              <button
                onClick={() => {
                  setShowModal(false);
                  setSelectedPlayerIds([]);
                  setCaptainId("");
                  setPlayerSearch("");
                  setTeamName("");
                  setLogoFilename("");
                  setEditingTeamId(null);
                }}
                className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400 text-black"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateOrEditTeam}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                disabled={!teamName.trim() || selectedPlayerIds.length === 0}
              >
                {editingTeamId ? "Save Changes" : "Create"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
