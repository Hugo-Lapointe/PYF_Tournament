import React from "react";

export default function GlowingBalls() {
  return (
    <>
      <div
        className="pointer-events-none fixed w-[40rem] h-[40rem] bg-blue-500 opacity-10 rounded-full blur-3xl animate-pulse top-[-5rem] left-[-5rem] -z-10"
        style={{ filter: "blur(64px)" }}
      />
      <div
        className="pointer-events-none fixed w-[40rem] h-[40rem] bg-indigo-400 opacity-10 rounded-full blur-3xl animate-pulse bottom-[-5rem] right-[-5rem] -z-10"
        style={{ filter: "blur(64px)" }}
      />
    </>
  );
}
