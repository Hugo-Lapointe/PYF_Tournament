import React, { useEffect, useState } from "react";
import Select from "react-select";
import { db } from "../../firebase";
import { collection, addDoc, getDocs } from "firebase/firestore";

export default function AdminTeams() {
  const [players, setPlayers] = useState([]);
  const [teamName, setTeamName] = useState("");
  const [selectedPlayers, setSelectedPlayers] = useState([]);

  useEffect(() => {
    const fetchPlayers = async () => {
      const snap = await getDocs(collection(db, "players"));
      setPlayers(snap.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    };
    fetchPlayers();
  }, []);

  const addTeam = async (e) => {
    e.preventDefault();
    if (!teamName.trim() || selectedPlayers.length === 0) return;
    const playerIds = selectedPlayers.map((p) => p.value);
    await addDoc(collection(db, "teams"), { name: teamName, players: playerIds });
    setTeamName("");
    setSelectedPlayers([]);
    alert("Team created!");
  };

  const playerOptions = players.map((p) => ({ value: p.id, label: p.name }));

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h2 className="text-2xl mb-4">Create Team</h2>
      <form onSubmit={addTeam} className="space-y-4">
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
        <button
          type="submit"
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Create Team
        </button>
      </form>
    </div>
  );
}
