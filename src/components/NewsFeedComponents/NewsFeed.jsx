import React, { useEffect, useState } from "react";
import axios from "axios";
import PostCard from "./Postcard";
import HighlightCarousel from "./HighlightCarousel";
import "./NewsFeed.css";
import { useOutletContext } from "react-router-dom";
// import EditPostModal from "./EditPostModal"; // 👈 Remember to create this component later

const NewsFeed = () => {
  const { userRole } = useOutletContext();
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState({
    title: "",
    content: "",
    imageFile: null,
  });

  // 🆕 NEW STATE for Editing
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState(null);

  // 💡 Add this log line to verify the role received from the parent
  console.log("NewsFeed Loaded. Current userRole:", userRole);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      console.log("🔄 Fetching posts...");
      const res = await axios.get("http://localhost:8080/api/posts", {
        withCredentials: true,
      });
      console.log("✅ Posts fetched successfully:", res.data.length, "posts");
      setPosts(res.data.reverse());
    } catch (err) {
      console.error("❌ Failed to fetch posts:", err);
      console.error("Error details:", err.response?.data);
    }
  };

  const handleChange = (e) => {
    setNewPost({ ...newPost, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    if (e.target.files.length > 0) {
      setNewPost({ ...newPost, imageFile: e.target.files[0] });
    }
  };

  const handlePost = async (e) => {
    e.preventDefault();
    // ... (existing handlePost logic) ...
    if (!newPost.title || !newPost.content) return;
    if (userRole !== "ADMIN") return;

    try {
      const formData = new FormData();
      formData.append("title", newPost.title);
      formData.append("content", newPost.content);
      if (newPost.imageFile) formData.append("image", newPost.imageFile);

      await axios.post("http://localhost:8080/api/posts", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });

      setNewPost({ title: "", content: "", imageFile: null });
      fetchPosts();
    } catch (err) {
      console.error("❌ POST failed!");
      console.error("Status:", err.response?.status);
      console.error("Data:", err.response?.data);
    }
  };

  // 🆕 HANDLER: Starts the edit process
  const handleEditStart = (post) => {
    if (userRole !== "ADMIN") return;
    setEditingPost(post);
    setIsEditModalOpen(true);
    console.log("📝 Starting edit for post:", post.id);
  };

  // 🆕 HANDLER: Sends the PUT request to save the edit
  const handleEditSave = async (updatedDetails) => {
    if (userRole !== "ADMIN" || !editingPost) return;

    try {
      await axios.put(
        `http://localhost:8080/api/posts/${editingPost.id}`,
        updatedDetails, // Contains { title, content }
        { withCredentials: true }
      );

      console.log("✅ Post edited successfully:", editingPost.id);

      // Close modal and refresh the feed
      setIsEditModalOpen(false);
      setEditingPost(null);
      fetchPosts();
    } catch (err) {
      console.error("❌ Failed to update post:", err);
    }
  };

  // 🆕 HANDLER: Sends the DELETE request
  const deletePost = async (postId) => {
    if (userRole !== "ADMIN") return;

    if (!window.confirm("Are you sure you want to delete this post?")) return;

    try {
      await axios.delete(`http://localhost:8080/api/posts/${postId}`, {
        withCredentials: true,
      });

      console.log(`✅ Post ${postId} deleted successfully.`);
      fetchPosts(); // Refresh the posts list
    } catch (err) {
      console.error("❌ Failed to delete post:", err);
    }
  };

  // 💡 Filter posts to ensure the carousel only gets posts with images
  const highlightPosts = posts.filter((post) => post.imageUrl).slice(0, 5);

  return (
    <div className="newsfeed-container">
      {/* 💡 Passing the filtered list to the carousel */}
      <HighlightCarousel posts={highlightPosts} />

      {userRole === "ADMIN" && (
        <div className="create-post-card">
          <h3>Create New Post (Admin Only)</h3>
          <input
            type="text"
            name="title"
            placeholder="Title"
            value={newPost.title}
            onChange={handleChange}
            className="create-post-title"
          />
          <textarea
            name="content"
            placeholder="What's on your mind?"
            value={newPost.content}
            onChange={handleChange}
            className="create-post-content"
          />

          <label className="file-label">
            {newPost.imageFile ? newPost.imageFile.name : "Choose Image"}
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              style={{ display: "none" }}
            />
          </label>

          <button onClick={handlePost} className="create-post-btn">
            Post
          </button>
        </div>
      )}

      <div className="posts-container">
        {posts.length > 0 ? (
          posts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              userRole={userRole}
              onDelete={deletePost}
              onEditStart={handleEditStart}
            />
          ))
        ) : (
          <p className="no-posts">No posts yet.</p>
        )}
      </div>

      {/* Edit Modal Placeholder */}
      {/* {isEditModalOpen && editingPost && (
                <EditPostModal
                    post={editingPost}
                    onSave={handleEditSave}
                    onClose={() => setIsEditModalOpen(false)}
                />
            )} */}
    </div>
  );
};

export default NewsFeed;
