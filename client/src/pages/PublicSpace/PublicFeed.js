import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from 'react-redux';

const API_BASE = "https://codequestfinal.onrender.com";

const PublicFeed = () => {
  const reduxUser = useSelector((state) => state.currentuserreducer?.result);
  const [posts, setPosts] = useState([]);
  const [media, setMedia] = useState(null);
  const [caption, setCaption] = useState("");
  const [canPost, setCanPost] = useState(false);
  const [message, setMessage] = useState("");
  const [commentText, setCommentText] = useState({});  // Store comment text for each post

  useEffect(() => {
    console.log('Current Redux User:', reduxUser);
    console.log('Friends Array:', reduxUser?.friends);
    console.log('Number of friends:', reduxUser?.friends?.length || 0);

    fetchPosts();
    if (reduxUser && reduxUser.friends && reduxUser.friends.length > 0) {
      console.log('Setting canPost to true');
      setCanPost(true);
    } else {
      console.log('Setting canPost to false');
      setCanPost(false);
    }
  }, [reduxUser]);

  const fetchPosts = async () => {
    try {
      const res = await axios.get(`${API_BASE}/publicposts`);
      setPosts(res.data);
    } catch (err) {
      console.error('Error fetching posts:', err);
    }
  };

  const handlePost = async (e) => {
    e.preventDefault();
    if (!media) return;
    
    console.log('Attempting to post with user:', reduxUser);
    
    const formData = new FormData();
    formData.append("media", media);
    formData.append("caption", caption);
    formData.append("userId", reduxUser._id);
    
    try {
      const response = await axios.post(`${API_BASE}/publicposts`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      console.log('Post response:', response);
      setCaption("");
      setMedia(null);
      setMessage("Posted!");
      fetchPosts();
    } catch (err) {
      console.error('Error posting:', err);
      setMessage(err.response?.data?.message || "Error posting");
    }
  };

  const handleDelete = async (postId) => {
    if (!window.confirm('Are you sure you want to delete this post?')) {
      return;
    }
    
    try {
      await axios.delete(`${API_BASE}/publicposts/${postId}?userId=${reduxUser._id}`);
      setMessage("Post deleted successfully!");
      fetchPosts(); // Refresh the posts list
    } catch (err) {
      console.error('Error deleting post:', err);
      setMessage(err.response?.data?.message || "Error deleting post");
    }
  };

  const handleLike = async (postId) => {
    try {
      await axios.post(`${API_BASE}/publicposts/${postId}/like`, { userId: reduxUser._id });
      fetchPosts(); // Refresh posts to update like count
    } catch (err) {
      setMessage(err.response?.data?.message || "Error liking post");
    }
  };

  const handleComment = async (postId) => {
    try {
      await axios.post(`${API_BASE}/publicposts/${postId}/comment`, { 
        userId: reduxUser._id,
        text: commentText[postId] 
      });
      setCommentText({ ...commentText, [postId]: '' }); // Clear comment input
      fetchPosts(); // Refresh posts to show new comment
    } catch (err) {
      setMessage(err.response?.data?.message || "Error adding comment");
    }
  };

  const handleShare = async (postId) => {
    try {
      await axios.post(`${API_BASE}/publicposts/${postId}/share`, { userId: reduxUser._id });
      setMessage("Post shared successfully!");
      fetchPosts(); // Refresh posts to update share count
    } catch (err) {
      setMessage(err.response?.data?.message || "Error sharing post");
    }
  };

  return (
    <div className="public-feed-container">
      <h2>Public Space</h2>
      {!reduxUser ? (
        <p>Please log in to access Public Space</p>
      ) : !canPost ? (
        <div>
          <p>You need friends to post.</p>
          <p>Current friend count: {reduxUser?.friends?.length || 0}</p>
        </div>
      ) : (
        <form onSubmit={handlePost} style={{ marginBottom: '20px' }}>
          <input
            type="file"
            accept="image/*,video/*"
            onChange={(e) => setMedia(e.target.files[0])}
            required
            style={{ marginRight: '10px' }}
          />
          <input
            type="text"
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            placeholder="Caption"
            style={{ marginRight: '10px' }}
          />
          <button type="submit">Post</button>
        </form>
      )}
      {message && <p style={{ color: message.includes('Error') ? 'red' : 'green' }}>{message}</p>}
      
      <div className="posts-container">
        {posts.map((post) => (
          <div key={post._id} className="post" style={{ 
            border: '1px solid #ccc', 
            padding: '15px',
            margin: '10px 0',
            borderRadius: '8px',
            backgroundColor: '#fff',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}>
            {/* Post author info */}
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
              <img 
                src={post.user.avatar ? `${API_BASE}${post.user.avatar}` : 'default-avatar.png'} 
                alt="avatar"
                style={{ width: '30px', height: '30px', borderRadius: '50%', marginRight: '10px' }}
              />
              <span style={{ fontWeight: 'bold' }}>{post.user.name}</span>
            </div>

            {/* Post media */}
            {post.mediaType === "image" ? (
              <img 
                src={`${API_BASE}${post.mediaUrl}`} 
                alt="Posted content"
                style={{ maxWidth: "100%", height: "auto", borderRadius: '8px' }}
              />
            ) : (
              <video 
                src={`${API_BASE}${post.mediaUrl}`}
                controls
                style={{ maxWidth: "100%", borderRadius: '8px' }}
              />
            )}

            {/* Caption */}
            <p style={{ margin: '10px 0' }}>{post.caption}</p>

            {/* Action buttons */}
            <div style={{ display: 'flex', gap: '10px', margin: '10px 0' }}>
              <button 
                onClick={() => handleLike(post._id)}
                style={{
                  padding: '5px 10px',
                  border: 'none',
                  borderRadius: '4px',
                  backgroundColor: post.likes.includes(reduxUser._id) ? '#1976d2' : '#e0e0e0',
                  color: post.likes.includes(reduxUser._id) ? 'white' : 'black',
                  cursor: 'pointer'
                }}
              >
                👍 Like ({post.likes.length})
              </button>
              
              <button 
                onClick={() => handleShare(post._id)}
                style={{
                  padding: '5px 10px',
                  border: 'none',
                  borderRadius: '4px',
                  backgroundColor: '#e0e0e0',
                  cursor: 'pointer'
                }}
              >
                🔄 Share ({post.shares.length})
              </button>

              {/* Delete button (only for post owner) */}
              {post.user === reduxUser._id && (
                <button 
                  onClick={() => handleDelete(post._id)}
                  style={{
                    padding: '5px 10px',
                    border: 'none',
                    borderRadius: '4px',
                    backgroundColor: '#ff4444',
                    color: 'white',
                    cursor: 'pointer'
                  }}
                >
                  🗑️ Delete
                </button>
              )}
            </div>

            {/* Comments section */}
            <div style={{ marginTop: '15px' }}>
              <h4 style={{ marginBottom: '10px' }}>Comments ({post.comments.length})</h4>
              
              {/* Comment input */}
              <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                <input
                  type="text"
                  value={commentText[post._id] || ''}
                  onChange={(e) => setCommentText({ ...commentText, [post._id]: e.target.value })}
                  placeholder="Add a comment..."
                  style={{ 
                    flex: 1,
                    padding: '8px',
                    borderRadius: '4px',
                    border: '1px solid #ccc'
                  }}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && commentText[post._id]?.trim()) {
                      handleComment(post._id);
                    }
                  }}
                />
                <button
                  onClick={() => handleComment(post._id)}
                  disabled={!commentText[post._id]?.trim()}
                  style={{
                    padding: '5px 15px',
                    border: 'none',
                    borderRadius: '4px',
                    backgroundColor: '#1976d2',
                    color: 'white',
                    cursor: commentText[post._id]?.trim() ? 'pointer' : 'not-allowed',
                    opacity: commentText[post._id]?.trim() ? 1 : 0.7
                  }}
                >
                  Comment
                </button>
              </div>

              {/* Comments list */}
              <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
                {post.comments.map((comment, index) => (
                  <div key={index} style={{ 
                    padding: '8px',
                    borderBottom: '1px solid #eee',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '10px'
                  }}>
                    <img 
                      src={comment.user.avatar ? `${API_BASE}${comment.user.avatar}` : 'default-avatar.png'}
                      alt="commenter avatar"
                      style={{ width: '24px', height: '24px', borderRadius: '50%' }}
                    />
                    <div>
                      <span style={{ fontWeight: 'bold', marginRight: '8px' }}>{comment.user.name}</span>
                      <span>{comment.text}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PublicFeed;
