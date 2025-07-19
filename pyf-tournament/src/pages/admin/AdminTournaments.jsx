import React, { useEffect, useState } from "react";
import Select from "react-select";
import { db } from "../../firebase";
import { collection, addDoc, getDocs } from "firebase/firestore";

export default function AdminTournaments() {
  const [teams, setTeams] = useState([]);
  const [tournamentName, setTournamentName] = useState("");
  const [selectedTeams, setSelectedTeams] = useState([]);

  useEffect(() => {
    const fetchTeams = async () => {
      const snap = await getDocs(collection(db, "teams"));
      setTeams(snap.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    };
    fetchTeams();
  }, []);

  const addTournament = async (e) => {
    e.preventDefault();
    if (!tournamentName.trim() || selectedTeams.length === 0) return;
    const teamIds = selectedTeams.map((t) => t.value);
    await addDoc(collection(db, "tournaments"), {
      name: tournamentName,
      teams: teamIds,
      matches: [],
      standings: [],
      createdAt: new Date(),
    });
    setTournamentName("");
    setSelectedTeams([]);
    alert("Tournament created!");
  };

  const teamOptions = teams.map((t) => ({ value: t.id, label: t.name }));

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl mb-4">Create Tournament</h2>
      <form onSubmit={addTournament} className="space-y-4">
        <input
          className="border p-2 rounded w-full"
          placeholder="Tournament Name"
          value={tournamentName}
          onChange={(e) => setTournamentName(e.target.value)}
        />
        <Select
          isMulti
          options={teamOptions}
          value={selectedTeams}
          onChange={setSelectedTeams}
          placeholder="Select Teams"
        />
        <button
          type="submit"
          className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
        >
          Create Tournament
        </button>
      </form>
    </div>
  );
}
