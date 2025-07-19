export function generateFirstRoundMatches(teamIds) {
  const teams = [...teamIds];
  // Shuffle teams randomly
  for (let i = teams.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [teams[i], teams[j]] = [teams[j], teams[i]];
  }

  const matches = [];
  const isOdd = teams.length % 2 === 1;

  // If odd number, assign a bye
  if (isOdd) {
    // Pick a random team for bye and remove from array
    const byeIndex = Math.floor(Math.random() * teams.length);
    const byeTeam = teams.splice(byeIndex, 1)[0];

    // Bye match (team automatically advances)
    matches.push({
      teamA: byeTeam,
      teamB: null,
      scoreA: null,
      scoreB: null,
      round: 1,
      completed: true,
      winner: byeTeam,
      date: null,
    });
  }

  // Pair remaining teams
  for (let i = 0; i < teams.length; i += 2) {
    matches.push({
      teamA: teams[i],
      teamB: teams[i + 1],
      scoreA: null,
      scoreB: null,
      round: 1,
      completed: false,
      winner: null,
      date: null,
    });
  }

  return matches;
}
