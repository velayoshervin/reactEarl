import React, { useState, useEffect } from "react";
import axios from "axios";

const ReplySection = ({ commentId }) => {
  const [replies, setReplies] = useState([]);
  const [newReply, setNewReply] = useState("");

  useEffect(() => {
    fetchReplies();
  }, []);

  const fetchReplies = async () => {
    const res = await axios.get(
      `http://localhost:8080/api/replies/comment/${commentId}`
    );
    setReplies(res.data);
  };

  const handleReplySubmit = async (e) => {
    e.preventDefault();
    if (!newReply.trim()) return;

    await axios.post(`http://localhost:8080/api/replies/comment/${commentId}`, {
      username: "User123",
      text: newReply,
    });

    setNewReply("");
    fetchReplies();
  };

  return (
    <div className="reply-section">
      {replies.map((reply) => (
        <div key={reply.id} className="reply-item">
          <strong>{reply.username}</strong>
          <p>{reply.text}</p>
        </div>
      ))}

      <form onSubmit={handleReplySubmit} className="reply-form">
        <input
          type="text"
          placeholder="Write a reply..."
          value={newReply}
          onChange={(e) => setNewReply(e.target.value)}
        />
        <button type="submit">Reply</button>
      </form>
    </div>
  );
};

export default ReplySection;
