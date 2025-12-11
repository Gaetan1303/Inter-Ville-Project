import React from "react";
import { useChallenges } from "../contexts/ChallengeContext";
import ChallengeCard from "../components/ChallengeCard";

export default function Feed() {
  const { challenges, loading } = useChallenges();

  if (loading) return <div className="center">Chargement...</div>;

  return (
    <div className="container">
      <header className="page-head">
        <h1>Flux des challenges</h1>
        <p className="muted">Découvre et participe aux défis de la promo.</p>
      </header>

      <div className="list">
        {challenges.map((defi) => (
          <ChallengeCard key={defi.id} defi={defi} />
        ))}
      </div>
    </div>
  );
}
