import React from "react";
import { motion } from "framer-motion";

export default function Rules() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <div className="min-h-screen bg-slate-900 flex flex-col items-center px-4 py-12">
        <h1 className="text-4xl font-extrabold mb-10 text-center max-w-xl text-white">
          PYF Esports Valorant Tournament Rules
        </h1>

        <div className="w-full max-w-3xl space-y-8">
          <Section title="General Conduct">
            <List items={[
              "Be cool. Respect players and staff.",
              "Trash talk is fine, but keep it fun — no racism, harassment, or hate speech.",
              "No cheating, exploiting, or using anything sketchy. Play fair or get DQ’d."
            ]} />
          </Section>

          <Section title="Participation Rules">
            <List items={[
              "Show up on time for your matches — late = forfeit.",
              "Follow all instructions from staff and referees.",
              "All tournament details (format, points, map bans) are in #tournament-info."
            ]} />
          </Section>

          <Section title="Penalties">
            <List items={[
              "Late to match: Forfeit the round or match.",
              "Toxic behavior or harassment: Warning → DQ if it keeps up.",
              "Cheating or exploiting: Immediate DQ and removal from the tournament."
            ]} />
          </Section>

          <Section title="Tournament Overview">
            <p className="secondary mb-4">
              Format: Round Robin → Single-Elimination Playoffs
            </p>
            <p className="secondary font-semibold mb-2">Point System:</p>
            <List items={[
              "Win (any kind) = 2 points",
              "Loss in Overtime = 1 point",
              "Loss in Regulation = 0 points"
            ]} />
            <p className="secondary font-semibold mb-2 mt-6">Tiebreakers (in order):</p>
            <List items={[
              "Round Differential (Rounds Won – Rounds Lost)",
              "Rounds Won (Most rounds won overall)",
              "Rounds Lost (Fewest rounds lost overall)",
              "Tiebreaker Match (if still tied)"
            ]} />
            <p className="secondary mt-6">
              Advancement to Playoffs:
              <br />
              1st Place vs 4th Place
              <br />
              2nd Place vs 3rd Place
              <br />
              Winners face off in the Grand Final: Single-elimination match to determine the tournament champion.
            </p>
          </Section>

          <Section title="Map Pool & Selection">
            <p className="secondary mb-4">
              All current Valorant maps are in play.
            </p>
            <p className="secondary font-semibold mb-2">Map Selection Process:</p>
            <List items={[
              "Both teams take turns banning maps until only 1 map remains.",
              "The team that did not make the final ban gets to pick the starting side.",
              "Map bans happen between team captains and the spectator before the game starts in the assigned match lobby."
            ]} />
          </Section>

          <Section title="Match Procedures">
            <p className="secondary font-semibold mb-2">Check-In:</p>
            <List items={[
              "Team captains must check in 15 minutes before their match in ⁠check-in.",
              "Teams that fail to check in on time may forfeit their match."
            ]} />
            <p className="secondary font-semibold mb-2 mt-6">Lobby Setup:</p>
            <List items={[
              "A custom lobby will be created for each match.",
              "Captains will be invited to the lobby, then invite their team.",
              "Make sure your team is ready to start within 10 minutes of invite."
            ]} />
            <p className="secondary font-semibold mb-2 mt-6">Disconnects / Tech Issues:</p>
            <List items={[
              "If a player disconnects, the round must finish.",
              "A pause of up to 10 minutes can be requested to resolve issues.",
              "If the team cannot continue, the match is forfeit."
            ]} />
          </Section>
        </div>
      </div>
    </motion.div>
  );
}

function Section({ title, children }) {
  return (
    <section className="bg-slate-800 rounded-lg p-6 shadow-md">
      <h2 className="text-2xl font-semibold mb-4 text-white">{title}</h2>
      {children}
    </section>
  );
}

function List({ items }) {
  return (
    <ul className="list-disc list-inside space-y-2 text-lg secondary">
      {items.map((item, i) => (
        <li key={i}>{item}</li>
      ))}
    </ul>
  );
}
