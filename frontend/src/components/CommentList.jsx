import React, { useEffect, useState } from "react";
import { useChallenges } from "../contexts/ChallengeContext";
import { useAuth } from "../contexts/AuthContext";

export default function CommentList({ challengeId }) {
  const { fetchComments,postComment } = useChallenges();
  const { user } = useAuth();
  const [comments, setComments] = useState([]);
  const [text, setText] = useState("");
  const [replyingTo, setReplyingTo] = useState(null); // {parentId, parentAuthor}
  const [replyText, setReplyText] = useState("");
  console.log('vocie les comments',comments); 

  useEffect(() => {
    load();
  }, [challengeId]);

 const load = async () => {
  const data = await fetchComments(challengeId);
  
  // Vérifier si la structure a déjà les replies imbriquées
  if (data.length > 0 && data[0].replies) {
    // Structure déjà organisée (avec replies array)
    setComments(data);
  } else {
    // Structure plate avec parent_id → regrouper
    const organized = data
      .filter((c) => !c.parent_id)
      .map((parent) => ({
        ...parent,
        replies: data.filter((c) => c.parent_id === parent.id),
      }));
    setComments(organized);
  }
};

// appel a la creation de commentaire lors du submit
    const submit = async (e) => {
    e.preventDefault();
    if (!user) return alert("Connecte-toi pour commenter");
    const res = await postComment({
      challengeId,      
      content: text,
    });
    setComments((prev) => [
    res,
      ...prev,
    ]);
    setText("");
  };

 

  const renderComment = (comment, isReply = false) => (
    <li
      key={comment.id}
      className={`comment-item ${isReply ? "comment-reply" : ""}`}
    >
      <div className="comment-card">
        <div className="meta">
          <strong>{comment.author?.first_name || "user#" + comment.user_id}</strong>
          {comment.author?.promo && <span className="promo"> • {comment.author.promo}</span>}
          {" "}
          <span className="date">
            {new Date(comment.createdAt).toLocaleDateString("fr-FR")}
          </span>
        </div>
        <div className="content">{comment.content}</div>
        <button
          className="reply-btn"
          onClick={() =>
            setReplyingTo({
              parentId: comment.id,
              parentAuthor: comment.author?.first_name || "user#" + comment.user_id,
            })
          }
        >
          Répondre
        </button>

        {/* Inline reply form si c'est ce commentaire */}
        {replyingTo?.parentId === comment.id && (
          <form className="reply-form" onSubmit={async (e) => {
            e.preventDefault();
            if (!replyText.trim()) return;
            await postComment({
              challengeId,
              content: replyText,
              parent_id: comment.id,
            });
            // Recharger tous les commentaires pour avoir la structure complète
            await load();
            setReplyingTo(null);
            setReplyText("");
          }}>
            <small className="reply-label">
              Répondre à {replyingTo.parentAuthor}
            </small>
            <textarea
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder="Écrire une réponse..."
              required
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
        )}
      </div>

      {/* Affiche les réponses imbriquées (replies array) */}
      {comment.replies && comment.replies.length > 0 && (
        <ul className="comments replies">
          {comment.replies.map((reply) => renderComment(reply, true))}
        </ul>
      )}
    </li>
  );

  return (
    <div className="comment-section">
      <h3>Commentaires</h3>
      <form onSubmit={submit} className="comment-form">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Écrire un commentaire..."
          required
        />
        <button type="submit" className="btn btn-primary">Poster</button>
      </form>

      <ul className="comments">
        {comments.map((c) => renderComment(c))}
      </ul>
    </div>
  );
}
