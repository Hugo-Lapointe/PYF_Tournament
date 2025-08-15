import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";

export default function Teams() {
  const [teams, setTeams] = useState([]);
  const [playersMap, setPlayersMap] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      const teamSnapshot = await getDocs(collection(db, "teams"));
      const fetchedTeams = teamSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));

      const playerSnapshot = await getDocs(collection(db, "players"));
      const fetchedPlayers = playerSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));

      const map = {};
      fetchedPlayers.forEach(p => (map[p.id] = p));

      setTeams(fetchedTeams);
      setPlayersMap(map);
    };

    fetchData();
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="p-6 max-w-6xl mx-auto"
    >
      <h1 className="text-3xl font-bold mb-6 text-white">Teams</h1>

      {teams.length === 0 ? (
        <p className="text-gray-400">No teams available.</p>
      ) : (
        teams.map(team => (
          <motion.div
            key={team.id}
            className="bg-slate-800 rounded-lg p-6 mb-4 shadow-lg flex items-center w-full"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            {/* Placeholder image */}
            <div className="w-24 h-24 bg-gray-600 rounded-lg flex-shrink-0 mr-8"></div>

            {/* Team & Players */}
            <div className="flex flex-col flex-1">
              <h2 className="text-2xl font-semibold text-white mb-4">
                {team.name}
              </h2>

              <div className="flex flex-wrap gap-6 items-center">
                {team.players && team.players.length > 0 ? (
                  team.players.map(playerId => {
                    const player = playersMap[playerId];
                    return player ? (
                      <Link
                        key={playerId}
                        to={`/players/${player.id}`}
                        className="text-lg text-white hover:text-gray-300 no-underline"
                      >
                        {player.displayName}
                      </Link>
                    ) : (
                      <span key={playerId} className="text-gray-400">
                        Unknown Player
                      </span>
                    );
                  })
                ) : (
                  <span className="text-gray-400">No players in this team.</span>
                )}
              </div>
            </div>
          </motion.div>
        ))
      )}
    </motion.div>
  );
}
