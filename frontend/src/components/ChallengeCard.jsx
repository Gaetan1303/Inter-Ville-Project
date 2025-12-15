import React from "react";
import { Link } from "react-router-dom";

export default function ChallengeCard({ defi }) {
  console.log('Rendering ChallengeCard for:', defi);
  return (
    <article className="card">
      <Link to={`/challenge/${defi.id}`} className="card-link">
        <div className="card-head">
          <h3>{defi.title}</h3>
          <span className="tag">{defi.category || 'default'}</span>
        </div>
        <p className="muted">{defi.description}</p>
        <div className="card-foot">
          <small>Posté le {new Date(defi.createdAt).toLocaleDateString()}</small>
        </div>
      </Link>
    </article>
  );
}
