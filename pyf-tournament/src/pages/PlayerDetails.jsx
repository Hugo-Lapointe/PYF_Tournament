import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";

export default function PlayerDetails() {
  const { id } = useParams();
  const [player, setPlayer] = useState(null);
  const [team, setTeam] = useState(null);

  useEffect(() => {
    const fetchPlayer = async () => {
      const playerRef = doc(db, "players", id);
      const playerSnap = await getDoc(playerRef);

      if (playerSnap.exists()) {
        const playerData = { id: playerSnap.id, ...playerSnap.data() };
        setPlayer(playerData);

        if (playerData.currentTeam) {
          const teamRef = doc(db, "teams", playerData.currentTeam);
          const teamSnap = await getDoc(teamRef);
          if (teamSnap.exists()) {
            const teamData = { id: teamSnap.id, ...teamSnap.data() };
            setTeam(teamData);
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

  const isCaptain = team && String(team.captainId) === String(player.id);

  return (
    <motion.div
      className="p-8 max-w-3xl mx-auto text-white bg-slate-900 rounded-xl shadow-2xl space-y-10"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
        {/* Player Image */}
        <div className="w-56 h-56 md:w-64 md:h-64 rounded-full overflow-hidden bg-gray-700 flex-shrink-0 border-4 border-gray-600">
          {player.imageFilename ? (
            <img
              src={`/images/phoques/${player.imageFilename}`}
              alt={player.displayName}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
              No Image
            </div>
          )}
        </div>

        {/* Player Info */}
        <div className="flex-1 space-y-4 text-center md:text-left">
          <h1 className="text-4xl font-bold flex items-center justify-center md:justify-start gap-3">
            {player.displayName}
            {isCaptain && (
              <span className="bg-yellow-400 text-black px-3 py-1 rounded text-sm font-semibold">
                Captain
              </span>
            )}
          </h1>

          <p className="text-lg">
            <strong>Current Team: </strong> 
            {team ? (
              <span>
                {team.name}
              </span>
            ) : (
              "N/A"
            )}
          </p>

          <p className="text-lg">
            <strong>In Game Name:</strong> {player.gameName || "N/A"}
          </p>

          <p className="text-lg">
            <strong>Current Rank:</strong> {player.valorantCurrentRank || "N/A"}
          </p>

          <p className="text-lg">
            <strong>Peak Rank:</strong> {player.valorantPeakRank || "N/A"}
          </p>

          <p className="text-lg">
            <strong>Discord Name:</strong> {player.discordName || "N/A"}
          </p>

          {player.age && (
            <p className="text-lg">
              <strong>Age:</strong> {player.age}
            </p>
          )}
        </div>
      </div>

      <div className="mt-6 text-center md:text-left">
        <Link
          to="/teams"
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg text-lg font-medium"
        >
          Back to Teams
        </Link>
      </div>
    </motion.div>
  );
}
