import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";

export default function Standings() {
  const [tournaments, setTournaments] = useState([]);
  const [teamsMap, setTeamsMap] = useState({});
  const [expandedTournamentId, setExpandedTournamentId] = useState(null);

  // Fetch all teams once, create id->name map
  const fetchTeams = async () => {
    const snap = await getDocs(collection(db, "teams"));
    const map = {};
    snap.docs.forEach((doc) => {
      map[doc.id] = doc.data().name;
    });
    setTeamsMap(map);
  };

  // Fetch all tournaments
  const fetchTournaments = async () => {
    const snap = await getDocs(collection(db, "tournaments"));
    setTournaments(
      snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
    );
  };

  useEffect(() => {
    fetchTeams();
    fetchTournaments();
  }, []);

  const toggleExpand = (id) => {
    setExpandedTournamentId((prev) => (prev === id ? null : id));
  };

  const renderMatch = (match, index) => {
    const teamA = teamsMap[match.teamAId] || "Team A";
    const teamB = teamsMap[match.teamBId] || "Team B";
    const scoreA = match.scoreA != null ? match.scoreA : "-";
    const scoreB = match.scoreB != null ? match.scoreB : "-";

    return (
      <div
        key={`${match.teamAId}-${match.teamBId}-${match.date || index}`}
        className="flex justify-between border p-2 rounded my-1"
      >
        <div>{teamA}</div>
        <div>
          {scoreA} : {scoreB}
        </div>
        <div>{teamB}</div>
      </div>
    );
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Tournaments</h1>

      {tournaments.length === 0 && <p>No tournaments found.</p>}

      {tournaments.map((tourney) => (
        <div key={tourney.id} className="border rounded p-4 mb-6 shadow">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">{tourney.name}</h2>

            <button
              onClick={() => toggleExpand(tourney.id)}
              className="text-blue-600 hover:underline"
            >
              {expandedTournamentId === tourney.id
                ? "Hide details"
                : "More details"}
            </button>
          </div>

          {/* Always show teams */}
          <div className="mt-2 mb-4">
            <h3 className="font-semibold mb-1">Teams</h3>
            {tourney.teams && tourney.teams.length > 0 ? (
              <ul className="list-disc list-inside text-gray-800">
                {tourney.teams.map((teamId) => (
                  <li key={teamId}>{teamsMap[teamId] || "Unknown Team"}</li>
                ))}
              </ul>
            ) : (
              <p>No teams assigned.</p>
            )}
          </div>

          {/* Show details only if expanded */}
          {expandedTournamentId === tourney.id && (
            <div className="mt-4 border-t pt-4">
              {tourney.completed ? (
                <>
                  <h3 className="font-semibold mb-2">Final Standings</h3>
                  {tourney.standings && tourney.standings.length > 0 ? (
                    <ol className="list-decimal list-inside mb-4">
                      {tourney.standings
                        .sort((a, b) => a.rank - b.rank)
                        .map((teamStanding, idx) => (
                          <li
                            key={teamStanding.teamId}
                            className={`mb-1 ${
                              idx === 0
                                ? "text-green-600 font-bold"
                                : "text-gray-900"
                            }`}
                          >
                            {teamsMap[teamStanding.teamId] || "Team"} - Rank:{" "}
                            {teamStanding.rank}, Points: {teamStanding.points}
                            {idx === 0 && " 🏆"}
                          </li>
                        ))}
                    </ol>
                  ) : (
                    <p>No standings available.</p>
                  )}

                  <h3 className="font-semibold mb-2">Match Results</h3>
                  {tourney.matches && tourney.matches.length > 0 ? (
                    <div>{tourney.matches.map(renderMatch)}</div>
                  ) : (
                    <p>No match results available.</p>
                  )}
                </>
              ) : (
                <>
                  <h3 className="font-semibold mb-2">Upcoming Matches</h3>
                  {tourney.matches && tourney.matches.length > 0 ? (
                    <>
                      {tourney.matches
                        .filter((m) => m.scoreA == null && m.scoreB == null)
                        .length === 0 && <p>No upcoming matches.</p>}

                      {tourney.matches
                        .filter((m) => m.scoreA == null && m.scoreB == null)
                        .map(renderMatch)}

                      <h3 className="font-semibold mt-4 mb-2">
                        Completed Matches
                      </h3>
                      {tourney.matches
                        .filter((m) => m.scoreA != null && m.scoreB != null)
                        .map(renderMatch)}
                    </>
                  ) : (
                    <p>No matches scheduled yet.</p>
                  )}
                </>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
