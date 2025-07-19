import React from "react";
import { Link } from "react-router-dom";

export default function Landing() {
  return (
    <div className="relative w-full h-screen overflow-hidden bg-black">
      {/* Video background */}
      <video
        className="absolute top-0 left-0 w-full h-full object-cover"
        src="/videos/ai-intro.mp4"
        autoPlay
        muted
        loop
        playsInline
      ></video>

      {/* Overlay */}
      <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-60 flex flex-col justify-center items-center px-6 text-center text-white">
        <h1 className="text-4xl md:text-6xl font-extrabold mb-4">
          Welcome to the Ultimate Tournament Hub
        </h1>
        <p className="max-w-2xl mb-8 text-lg md:text-xl">
          Join the competition, showcase your skills, and track results with
          ease.
        </p>
        <Link
          to="/apply"
          className="bg-blue-600 hover:bg-blue-700 transition-colors px-8 py-4 rounded text-xl font-semibold shadow-lg"
        >
          Apply for a Tournament
        </Link>
      </div>
    </div>
  );
}
