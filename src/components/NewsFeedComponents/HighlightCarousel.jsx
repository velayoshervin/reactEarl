import React from "react";

const HighlightCarousel = ({ posts }) => {

    // Helper to construct the image URL
    const getImageUrl = (imageUrlPath) => {
        if (!imageUrlPath) return null;

        let cleanImageUrl = imageUrlPath;
        if (cleanImageUrl.startsWith('/')) {
            cleanImageUrl = cleanImageUrl.substring(1);
        }

        return `http://localhost:8080/${cleanImageUrl}`;
    };

    // Helper to display name or extract from email
    const getDisplayName = (post) => {
        if (post.author) {
            if (post.author.name) return post.author.name;
            if (post.author.email) return post.author.email.split('@')[0];
        }
        return "User";
    };

    return (
        <div className="highlight-carousel">
            {posts.map((post) => {
                const imageUrl = getImageUrl(post.imageUrl);
                const displayName = getDisplayName(post);

                return (
                    <div key={post.id} className="highlight-item">
                        {/* Image Container with Overlay */}
                        <div className="highlight-image-container">
                            {imageUrl ? (
                                <img
                                    src={imageUrl}
                                    alt={post.title || "Highlight"}
                                    className="highlight-image"
                                    onError={(e) => { 
                                        e.target.style.display = 'none'; 
                                        e.target.nextSibling.style.display = 'flex';
                                    }}
                                />
                            ) : (
                                <div className="no-img">
                                    {displayName.charAt(0).toUpperCase()}
                                </div>
                            )}
                            
                            {/* Author Name Overlay */}
                            <div className="highlight-overlay">
                                <div className="highlight-avatar">
                                    {displayName.charAt(0).toUpperCase()}
                                </div>
                                <span className="highlight-author">{displayName}</span>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default HighlightCarousel;