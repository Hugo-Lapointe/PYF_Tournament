// src/pages/admin/AdminMatches.jsx
import React, { useEffect, useState } from "react";
import Select from "react-select";
import { db } from "../../firebase";
import { collection, getDocs, doc, updateDoc, arrayUnion } from "firebase/firestore";

export default function AdminMatches() {
  const [tournaments, setTournaments] = useState([]);
  const [teams, setTeams] = useState([]);
  const [selectedTournament, setSelectedTournament] = useState(null);
  const [teamA, setTeamA] = useState(null);
  const [teamB, setTeamB] = useState(null);
  const [scoreA, setScoreA] = useState("");
  const [scoreB, setScoreB] = useState("");

  useEffect(() => {
    const fetchTournaments = async () => {
      const snap = await getDocs(collection(db, "tournaments"));
      setTournaments(snap.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    };
    fetchTournaments();
  }, []);

  useEffect(() => {
    const fetchTeams = async () => {
      const snap = await getDocs(collection(db, "teams"));
      setTeams(snap.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    };
    fetchTeams();
  }, []);

  const submitResult = async (e) => {
    e.preventDefault();

    if (!selectedTournament || !teamA || !teamB) {
      alert("Please select a tournament and two different teams.");
      return;
    }
    if (teamA === teamB) {
      alert("Teams must be different.");
      return;
    }
    if (scoreA === "" || scoreB === "") {
      alert("Please enter scores for both teams.");
      return;
    }

    const tournamentRef = doc(db, "tournaments", selectedTournament);
    const match = {
      teamA,
      teamB,
      scoreA: Number(scoreA),
      scoreB: Number(scoreB),
      date: new Date(),
    };

    try {
      await updateDoc(tournamentRef, {
        matches: arrayUnion(match),
      });
      alert("Match result submitted!");
      setTeamA(null);
      setTeamB(null);
      setScoreA("");
      setScoreB("");
    } catch (error) {
      alert("Error submitting result: " + error.message);
    }
  };

  const tournamentOptions = tournaments.map((t) => ({
    value: t.id,
    label: t.name,
  }));

  const teamOptions = teams.map((t) => ({
    value: t.id,
    label: t.name,
  }));

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl mb-4">Submit Match Results</h2>
      <form onSubmit={submitResult} className="space-y-6">
        <div>
          <label className="block mb-1 font-semibold">Tournament</label>
          <Select
            options={tournamentOptions}
            value={tournamentOptions.find((t) => t.value === selectedTournament) || null}
            onChange={(opt) => setSelectedTournament(opt ? opt.value : null)}
            placeholder="Select Tournament"
          />
        </div>
        <div>
          <label className="block mb-1 font-semibold">Team A</label>
          <Select
            options={teamOptions}
            value={teamOptions.find((t) => t.value === teamA) || null}
            onChange={(opt) => setTeamA(opt ? opt.value : null)}
            placeholder="Select Team A"
          />
        </div>
        <div>
          <label className="block mb-1 font-semibold">Team B</label>
          <Select
            options={teamOptions}
            value={teamOptions.find((t) => t.value === teamB) || null}
            onChange={(opt) => setTeamB(opt ? opt.value : null)}
            placeholder="Select Team B"
          />
        </div>
        <div className="flex space-x-4">
          <input
            type="number"
            placeholder="Score Team A"
            value={scoreA}
            onChange={(e) => setScoreA(e.target.value)}
            className="border p-2 rounded w-1/2"
            min={0}
          />
          <input
            type="number"
            placeholder="Score Team B"
            value={scoreB}
            onChange={(e) => setScoreB(e.target.value)}
            className="border p-2 rounded w-1/2"
            min={0}
          />
        </div>
        <button
          type="submit"
          className="bg-red-600 text-white px-6 py-2 rounded hover:bg-red-700"
        >
          Submit Result
        </button>
      </form>
    </div>
  );
}
