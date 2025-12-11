import React from "react";
import ChallengeCard from "../components/ChallengeCard";

export default function Challenges() {
  const loading = false;
  const challenges = [
    {
      id: 1,
      title: "Premier défi",
      description: "Challenge 1",
      category: "Sport",
      createdAt: new Date(),
    },
    {
      id: 2,
      title: "deuxieme défi",
      description: "Challenge 2",
      category: "code",
      createdAt: new Date(),
    },
    {
      id: 3,
      title: "troisieme défi",
      description: "Challenge 3",
      category: "cuisine",
      createdAt: new Date(),
    },
  ];

  if (loading) return <div className="center">Chargement...</div>;

  return (
    <div className="container">
      <header className="page-head">
        <h1>Flux des challenges</h1>
        <p className="muted">Découvre et participe aux défis de la promo.</p>
      </header>

      <div className="list">
        {challenges.map((c) => (
          <ChallengeCard key={c.id} c={c} />
        ))}
      </div>
    </div>
  );
}
