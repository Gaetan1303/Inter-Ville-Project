import React, { useEffect, useState } from "react";
import { useChallenges } from "../contexts/ChallengeContext";
import { useAuth } from "../contexts/AuthContext";

export default function CommentList({ challengeId }) {
  const { fetchComments } = useChallenges();
  const { user } = useAuth();
  const [comments, setComments] = useState([]);
  const [text, setText] = useState("");
  const [replyingTo, setReplyingTo] = useState(null); // {parentId, parentAuthor}
  const [replyText, setReplyText] = useState("");

  useEffect(() => {
    load();
  }, [challengeId]);

  const load = async () => {
    const data = await fetchComments(challengeId);
    setComments(data);
  };

 

  // Organise les commentaires : racines et réponses
  const rootComments = comments.filter((c) => !c.parentId);
  const getChildren = (parentId) =>
    comments.filter((c) => c.parentId === parentId);

  const renderComment = (comment, isReply = false) => (
    <li
      key={comment.id}
      className={`comment-item ${isReply ? "comment-reply" : ""}`}
    >
      <div className="meta">
        <strong>{comment.author?.pseudo || "user#" + comment.userId}</strong> •{" "}
        {new Date(comment.createdAt).toLocaleString()}
      </div>
      <div className="content">{comment.content || comment.text}</div>
      <button
        className="reply-btn"
        onClick={() =>
          setReplyingTo({
            parentId: comment.id,
            parentAuthor: comment.author?.pseudo || "user#" + comment.userId,
          })
        }
      >
        Répondre
      </button>

      {/* Inline reply form si c'est ce commentaire */}
      {replyingTo?.parentId === comment.id && (
        <form className="reply-form" >
          <small className="reply-label">
            Répondre à {replyingTo.parentAuthor}
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
      )}

      {/* Affiche les réponses imbriquées */}
      {getChildren(comment.id).length > 0 && (
        <ul className="comments replies">
          {getChildren(comment.id).map((reply) => renderComment(reply, true))}
        </ul>
      )}
    </li>
  );

  return (
    <div>
      <form  className="comment-form">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Écrire un commentaire..."
        />
        <button type="submit">Poster</button>
      </form>

      <ul className="comments">{rootComments.map((c) => renderComment(c))}</ul>
    </div>
  );
}
