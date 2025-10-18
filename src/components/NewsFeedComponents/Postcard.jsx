import React, { useState } from "react";
import CommentSection from "./CommentSection";

const PostCard = ({ post, userRole, onDelete, onEditStart }) => { 
    const [liked, setLiked] = useState(false);
    const [imageError, setImageError] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
    const handleAction = (actionFunction, payload) => {
        setIsMenuOpen(false);
        actionFunction(typeof payload === 'object' ? payload : payload.id); 
    };

    const getImageUrl = () => {
        if (!post.imageUrl) return null;
        let cleanImageUrl = post.imageUrl.startsWith('/') ? post.imageUrl.substring(1) : post.imageUrl;
        return `http://localhost:8080/${cleanImageUrl}`;
    };

    const getDisplayName = () => {
        if (post.author) {
            if (post.author.name) return post.author.name;
            if (post.author.email) return post.author.email.split('@')[0];
        }
        return 'Unknown User';
    };

    const getFormattedDate = () => {
        const dateValue = post.createdAt ? post.createdAt : new Date();
        return new Date(dateValue).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    const imageUrl = getImageUrl();

    return (
        <div className="post-card">
            
            {/* Post Header */}
            <div className="post-header">
                <div className="post-author">
                    <div className="author-info">
                        <div className="author-avatar">
                            {getDisplayName().charAt(0).toUpperCase()}
                        </div>
                        <div className="author-details">
                            <span className="author-name">{getDisplayName()}</span>
                            <span className="post-date">{getFormattedDate()}</span>
                        </div>
                    </div>
                </div>

                {userRole === "ADMIN" && (
                    <div className="admin-actions-menu">
                        <button onClick={toggleMenu} className="kebab-btn">•••</button>
                        {isMenuOpen && (
                            <div className="dropdown-menu">
                                <button 
                                    onClick={() => handleAction(onEditStart, post)} 
                                    className="menu-item"
                                >
                                    Edit 📝
                                </button>
                                <button 
                                    onClick={() => handleAction(onDelete, post.id)} 
                                    className="menu-item delete"
                                >
                                    Delete 🗑️
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* 🆕 Title moved above image */}
            <div className="post-title-top">
                <h4>{post.title}</h4>
            </div>

            {/* Image Section */}
            {imageUrl && !imageError ? (
                <div className="post-image-container">
                    <img 
                        src={imageUrl} 
                        alt={post.title}
                        className="post-image"
                        onError={() => setImageError(true)}
                    />
                </div>
            ) : imageError && (
                <div style={{ padding: '10px', background: '#f5f5f5', borderRadius: '5px', marginBottom: '10px' }}>
                    Image failed to load
                </div>
            )}
            
            {/* Content Section */}
            <div className="post-content">
                <p>{post.content}</p>
                <div className="post-footer">
                    <button
                        className={`heart-btn ${liked ? "liked" : ""}`}
                        onClick={() => setLiked(!liked)}
                    >
                        ❤️
                    </button>
                    <span>{liked ? "You and others liked this" : "Like"}</span>
                </div>
            </div>
            <CommentSection postId={post.id} />
        </div>
    );
};

export default PostCard;
