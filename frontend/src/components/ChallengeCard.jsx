import React from "react";
import { Link } from "react-router-dom";

export default function ChallengeCard({ c }) {
  return (
    <article className="card">
      <Link to={`/challenge/${c.id}`} className="card-link">
        <div className="card-head">
          <h3>{c.title}</h3>
          <span className="tag">{c.category}</span>
        </div>
        <p className="muted">{c.description}</p>
        <div className="card-foot">
          <small>Posté le {new Date(c.createdAt).toLocaleDateString()}</small>
        </div>
      </Link>
    </article>
  );
}
