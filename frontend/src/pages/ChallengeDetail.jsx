import React from "react";
import { useParams } from "react-router-dom";
import CommentList from "../components/CommentList";


export default function ChallengePage() {
  const { id } = useParams();   

  return (
    <div className="container">
      <article className="detail">
        <h2>title</h2>
        <div className="meta">
          Code • difficile • Posté par{" "}
          Achraf
        </div>
        <p>description</p>
      

        <div style={{ marginTop: "12px" }}>
          <button>Participer</button>
        </div>
      </article>

      <section style={{ marginTop: "20px" }}>
        <h3>Commentaires</h3>
        <CommentList   />
       

      </section>
    </div>
  );
}
