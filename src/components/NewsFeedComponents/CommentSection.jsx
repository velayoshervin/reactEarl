import React, { useEffect, useState } from "react";
import axios from "axios";
import ReplySection from "./ReplySection";

const CommentSection = ({ postId }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");

  const fetchComments = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/comments");
      setComments(res.data.filter((c) => c.post?.id === postId));
    } catch (err) {
      console.error("Failed to fetch comments:", err.message);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [postId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    try {
      await axios.post(`http://localhost:8080/api/comments/post/${postId}`, {
        username: "User123",
        text: newComment,
      });
      setNewComment("");
      fetchComments();
    } catch (err) {
      console.error("Failed to post comment:", err.message);
    }
  };

  return (
    <div className="comment-section">
      <h5>Comments</h5>
      {comments.map((comment) => (
        <div key={comment.id} className="comment-item">
          <strong>{comment.username}</strong>
          <p>{comment.text}</p>
          <ReplySection commentId={comment.id} />
        </div>
      ))}

      <form onSubmit={handleSubmit} className="comment-form">
        <input
          type="text"
          placeholder="Write a comment..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
};

export default CommentSection;
