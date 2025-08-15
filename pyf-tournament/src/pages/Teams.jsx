import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";

export default function Teams() {
  const [teams, setTeams] = useState([]);
  const [playersMap, setPlayersMap] = useState({});
  const [imageStyles, setImageStyles] = useState({});

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

  const handleImageLoad = (playerId, event) => {
    const { naturalWidth, naturalHeight } = event.target;
    const isSmall = naturalWidth <= 64 || naturalHeight <= 64;

    setImageStyles(prev => ({
      ...prev,
      [playerId]: {
        width: "96px",
        height: "96px",
        borderRadius: "9999px",
        border: "2px solid #6b7280",
        objectFit: "cover",
        imageRendering: isSmall ? "pixelated" : "auto",
      }
    }));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="p-6 max-w-6xl mx-auto"
    >
      <h1 className="text-3xl font-bold mb-8 text-center text-white">Teams</h1>

      {teams.length === 0 ? (
        <p className="text-gray-400 text-center">No teams available.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {teams.map(team => (
            <motion.div
              key={team.id}
              className="bg-slate-800 rounded-lg p-6 shadow-lg flex flex-col items-center"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
            >
              {/* Team Logo */}
              <div className="w-32 h-32 rounded-lg overflow-hidden bg-gray-600 mb-4">
                {team.logoFilename ? (
                  <img
                    src={`/images/team-logos/${team.logoFilename}`}
                    alt={`${team.name} Logo`}
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-300 text-sm">
                    No Logo
                  </div>
                )}
              </div>

              {/* Team Name */}
              <h2 className="text-2xl font-semibold text-white mb-4 text-center">
                {team.name}
              </h2>

              {/* Players */}
              <div className="flex flex-col items-center gap-4">
                {team.players && team.players.length > 0 ? (
                  // Sort players: captain first
                  [...team.players]
                    .sort((a, b) => (b === team.captainId ? 1 : a === team.captainId ? -1 : 0))
                    .map(playerId => {
                      const player = playersMap[playerId];
                      if (!player) return (
                        <span key={playerId} className="text-gray-400">
                          Unknown Player
                        </span>
                      );

                      const isCaptain = team.captainId === player.id;

                      return (
                        <Link
                          key={player.id}
                          to={`/players/${player.id}`}
                          className="flex flex-col items-center gap-2 text-white hover:text-gray-300 no-underline"
                        >
                          {player.imageFilename ? (
                            <img
                              src={`/images/phoques/${player.imageFilename}`}
                              alt={player.displayName}
                              style={imageStyles[player.id] || {}}
                              onLoad={e => handleImageLoad(player.id, e)}
                            />
                          ) : (
                            <div className="w-24 h-24 rounded-full bg-gray-600 flex items-center justify-center text-xs text-gray-300">
                              ?
                            </div>
                          )}
                          <span className="font-medium">
                            {player.displayName} {isCaptain && "(Captain)"}
                          </span>
                        </Link>
                      );
                    })
                ) : (
                  <span className="text-gray-400">No players in this team.</span>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
}
