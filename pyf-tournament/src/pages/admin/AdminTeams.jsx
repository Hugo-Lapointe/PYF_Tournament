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
  const [selectedPlayerIds, setSelectedPlayerIds] = useState([]);
  const [playerSearch, setPlayerSearch] = useState("");

  // For editing
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

    // Remove currentTeam reference from players
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

    if (editingTeamId) {
      // Update existing team
      const teamRef = doc(db, "teams", editingTeamId);
      await updateDoc(teamRef, { name: teamName.trim(), players: selectedPlayerIds });

      // Update players' currentTeam
      const prevTeam = teams.find((t) => t.id === editingTeamId);
      const prevPlayerIds = prevTeam?.players || [];

      // Remove previous team from players no longer in the team
      for (const playerId of prevPlayerIds.filter((id) => !selectedPlayerIds.includes(id))) {
        await updateDoc(doc(db, "players", playerId), { currentTeam: null });
      }

      // Add currentTeam to new players
      for (const playerId of selectedPlayerIds) {
        await updateDoc(doc(db, "players", playerId), { currentTeam: editingTeamId });
      }
    } else {
      // Create new team
      const teamData = {
        name: teamName.trim(),
        players: selectedPlayerIds,
      };

      const newTeamRef = await addDoc(collection(db, "teams"), teamData);

      for (const playerId of selectedPlayerIds) {
        await updateDoc(doc(db, "players", playerId), { currentTeam: newTeamRef.id });
      }
    }

    // Reset modal
    setTeamName("");
    setSelectedPlayerIds([]);
    setPlayerSearch("");
    setEditingTeamId(null);
    setShowModal(false);

    fetchData();
  };

  const handleTogglePlayer = (playerId) => {
    setSelectedPlayerIds((prev) =>
      prev.includes(playerId) ? prev.filter((id) => id !== playerId) : [...prev, playerId]
    );
  };

  const handleEditTeam = (team) => {
    setEditingTeamId(team.id);
    setTeamName(team.name);
    setSelectedPlayerIds(team.players || []);
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
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-lg font-semibold">{team.name}</h2>
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
              <div className="mb-4 border-t border-gray-700 pt-2">
                <p className="font-semibold mb-2">Selected Players:</p>
                <ul className="list-disc list-inside max-h-32 overflow-y-auto text-white">
                  {selectedPlayerIds.map((id) => {
                    const player = playersMap[id];
                    return (
                      <li key={id}>
                        {player?.gameName + " (" + player?.valorantCurrentRank + ")" ||
                          "Unknown Player"}
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
                  setPlayerSearch("");
                  setTeamName("");
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
                title={
                  !teamName.trim()
                    ? "Team name is required"
                    : selectedPlayerIds.length === 0
                    ? "Select at least one player"
                    : ""
                }
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
