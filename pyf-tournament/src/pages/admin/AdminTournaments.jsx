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

export default function AdminTournaments() {
  const [teams, setTeams] = useState([]);
  const [players, setPlayers] = useState([]);
  const [tournaments, setTournaments] = useState([]);

  const [tournamentName, setTournamentName] = useState("");
  const [selectedTeams, setSelectedTeams] = useState([]);

  // Editing state
  const [editingId, setEditingId] = useState(null);

  // Fetch teams and players
  useEffect(() => {
    const fetchTeams = async () => {
      const snap = await getDocs(collection(db, "teams"));
      setTeams(snap.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    };

    const fetchPlayers = async () => {
      const snap = await getDocs(collection(db, "players"));
      setPlayers(snap.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    };

    fetchTeams();
    fetchPlayers();
  }, []);

  // Fetch tournaments
  const fetchTournaments = async () => {
    const snap = await getDocs(collection(db, "tournaments"));
    setTournaments(snap.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
  };

  useEffect(() => {
    fetchTournaments();
  }, []);

  // Create or update tournament
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!tournamentName.trim() || selectedTeams.length === 0) return;

    const teamIds = selectedTeams.map((t) => t.value);

    if (editingId) {
      await updateDoc(doc(db, "tournaments", editingId), {
        name: tournamentName,
        teams: teamIds,
      });
      setEditingId(null);
    } else {
      await addDoc(collection(db, "tournaments"), {
        name: tournamentName,
        teams: teamIds,
        matches: [],
        standings: [],
        createdAt: new Date(),
      });
    }

    setTournamentName("");
    setSelectedTeams([]);
    fetchTournaments();
  };

  // Delete tournament
  const deleteTournament = async (id) => {
    if (
      window.confirm(
        "Are you sure you want to delete this tournament? This action cannot be undone."
      )
    ) {
      await deleteDoc(doc(db, "tournaments", id));
      if (editingId === id) {
        setEditingId(null);
        setTournamentName("");
        setSelectedTeams([]);
      }
      fetchTournaments();
    }
  };

  // Start editing a tournament
  const startEditing = (tourney) => {
    setEditingId(tourney.id);
    setTournamentName(tourney.name);

    const selected = tourney.teams
      .map((tid) => {
        const team = teams.find((t) => t.id === tid);
        return team ? { value: team.id, label: team.name } : null;
      })
      .filter(Boolean);

    setSelectedTeams(selected);
  };

  // Cancel editing
  const cancelEditing = () => {
    setEditingId(null);
    setTournamentName("");
    setSelectedTeams([]);
  };

  const teamOptions = teams.map((t) => ({
    value: t.id,
    label: t.name,
  }));

  // Helper: get player names for a team
  const getPlayerNames = (team) => {
    if (!team?.players?.length) return "No players";
    return team.players
      .map((pid) => players.find((p) => p.id === pid)?.name)
      .filter(Boolean)
      .join(", ");
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h2 className="text-2xl mb-4">{editingId ? "Edit Tournament" : "Create Tournament"}</h2>
      <form onSubmit={handleSubmit} className="space-y-4 mb-6">
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
        <div className="space-x-4">
          <button
            type="submit"
            className={`px-4 py-2 rounded text-white ${
              editingId ? "bg-yellow-600 hover:bg-yellow-700" : "bg-purple-600 hover:bg-purple-700"
            }`}
          >
            {editingId ? "Save Changes" : "Create Tournament"}
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

      <h3 className="text-xl mb-3">Tournaments List</h3>
      <ul className="space-y-4">
        {tournaments.map((tourney) => (
          <li
            key={tourney.id}
            className="border p-4 rounded flex flex-col md:flex-row justify-between items-start md:items-center"
          >
            <div className="mb-3 md:mb-0">
              <strong>{tourney.name}</strong>
              <div className="mt-1 text-sm text-gray-600">
                Teams:
                <ul className="list-disc list-inside ml-4">
                  {tourney.teams.map((tid) => {
                    const team = teams.find((t) => t.id === tid);
                    if (!team) return null;
                    return (
                      <li key={tid}>
                        <span>{team.name}</span> -{" "}
                        <em className="text-gray-500">{getPlayerNames(team)}</em>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>

            <div className="space-x-3">
              <button
                onClick={() => startEditing(tourney)}
                className="text-yellow-600 hover:text-yellow-800"
              >
                Edit
              </button>
              <button
                onClick={() => deleteTournament(tourney.id)}
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
