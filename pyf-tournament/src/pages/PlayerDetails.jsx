import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";

export default function PlayerDetails() {
  const { id } = useParams();
  const [player, setPlayer] = useState(null);
  const [teamName, setTeamName] = useState("");

  useEffect(() => {
    const fetchPlayer = async () => {
      // Get player details
      const playerRef = doc(db, "players", id);
      const playerSnap = await getDoc(playerRef);

      if (playerSnap.exists()) {
        const playerData = playerSnap.data();
        setPlayer(playerData);

        // Fetch team name if player has a current team
        if (playerData.currentTeam) {
          const teamRef = doc(db, "teams", playerData.currentTeam);
          const teamSnap = await getDoc(teamRef);
          if (teamSnap.exists()) {
            setTeamName(teamSnap.data().name);
          }
        }
      }
    };

    fetchPlayer();
  }, [id]);

  if (!player) {
    return (
      <motion.div
        className="p-6 text-center text-white"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        Loading player details...
      </motion.div>
    );
  }

  return (
    <motion.div
      className="p-6 max-w-3xl mx-auto text-white"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <h1 className="text-3xl font-bold mb-4">{player.gameName}</h1>

      {player.valorantCurrentRank && (
        <p className="mb-2">
          <strong>Valorant Rank:</strong> {player.valorantCurrentRank}
        </p>
      )}

      <p className="mb-2">
        <strong>Current Team:</strong>{" "}
        {teamName ? (
          <Link
            to={`/teams/${player.currentTeam}`}
            className="text-blue-400 hover:underline"
          >
            {teamName}
          </Link>
        ) : (
          "N/A"
        )}
      </p>

      {player.email && (
        <p className="mb-2">
          <strong>Email:</strong> {player.email}
        </p>
      )}

      {player.age && (
        <p className="mb-2">
          <strong>Age:</strong> {player.age}
        </p>
      )}

      <div className="mt-6">
        <Link
          to="/teams"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
        >
          Back to Teams
        </Link>
      </div>
    </motion.div>
  );
}
