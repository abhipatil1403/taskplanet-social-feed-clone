import React, { useState, useEffect, useCallback } from 'react';
import { Container, Box, Typography, CircularProgress, Alert } from '@mui/material';
import axios from 'axios';
import CreatePost from '../components/CreatePost';
import PostCard from '../components/PostCard';

const Feed = ({ user, token, API_URL }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchPosts = useCallback(async () => {
    try {
      const response = await axios.get(`${API_URL}/api/posts`);
      setPosts(response.data);
    } catch (err) {
      setError('Failed to fetch posts. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [API_URL]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const handlePostCreated = async (newPostData) => {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const response = await axios.post(`${API_URL}/api/posts`, newPostData, config);
    setPosts((prevPosts) => [response.data, ...prevPosts]);
  };

  const handleLikeToggle = async (postId) => {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    try {
      const response = await axios.put(`${API_URL}/api/posts/${postId}/like`, {}, config);
      setPosts((prevPosts) =>
        prevPosts.map((post) => (post._id === postId ? response.data : post))
      );
    } catch (err) {
      console.error('Like toggle failed', err);
    }
  };

  const handleCommentSubmit = async (postId, commentText) => {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const response = await axios.post(
      `${API_URL}/api/posts/${postId}/comment`,
      { comment: commentText },
      config
    );
    setPosts((prevPosts) =>
      prevPosts.map((post) => (post._id === postId ? response.data : post))
    );
  };

  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      {user && (
        <CreatePost onPostCreated={handlePostCreated} username={user.username} />
      )}

      {!user && (
        <Alert severity="info" sx={{ mb: 3 }}>
          Log in or sign up to create posts, like, and comment!
        </Alert>
      )}

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {loading ? (
        <Box display="flex" justifyContent="center" py={4}>
          <CircularProgress />
        </Box>
      ) : posts.length > 0 ? (
        <Box>
          {posts.map((post) => (
            <PostCard
              key={post._id}
              post={post}
              currentUserId={user?._id}
              onLikeToggle={handleLikeToggle}
              onCommentSubmit={handleCommentSubmit}
            />
          ))}
        </Box>
      ) : (
        <Typography variant="body1" align="center" color="text.secondary" sx={{ py: 4 }}>
          No posts available. Be the first to publish a post!
        </Typography>
      )}
    </Container>
  );
};

export default Feed;
