import React, {  useState } from "react";


export default function CommentList() { 

  const [text, setText] = useState("");
  const [replyingTo, setReplyingTo] = useState(null); // {parentId, parentAuthor}
  const [replyText, setReplyText] = useState("");  

  return (
    <div>
      <form className="comment-form">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Écrire un commentaire..."
        />
        <button type="submit">Poster</button>
      </form>

      <ul className="comments">
         <li
      
      className= "comment-reply"
    >
      <div className="meta">
        <strong>user# commentaire</strong> •{" "}
        {new Date().toLocaleString()}
      </div>
      <div className="content">content</div>
      <button
        className="reply-btn"
       
      >
        Répondre
      </button>     
       
        <form className="reply-form" >
          <small className="reply-label">
            Répondre à perentAuthor
          </small>
          <textarea
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            placeholder="Écrire une réponse..."
          />
          <div className="reply-actions">
            <button type="submit">Poster</button>
            <button
              type="button"
              className="ghost-btn"
              onClick={() => {
                setReplyingTo(null);
                setReplyText("");
              }}
            >
              Annuler
            </button>
          </div>
        </form>
      

      {/* Affiche les réponses imbriquées */}
       
        <ul className="comments replies">
          <li>c'est super</li>
          <li>c'est super</li>
        </ul>
      
    </li>
      </ul>
    </div>
  );
}
