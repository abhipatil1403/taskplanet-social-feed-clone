import React, { useState } from 'react';
import { Card, CardHeader, CardContent, CardActions, Collapse, Avatar, IconButton, Typography, Button, TextField, Box, Divider, List } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import CommentIcon from '@mui/icons-material/Comment';
import SendIcon from '@mui/icons-material/Send';

const PostCard = ({ post, currentUserId, onLikeToggle, onCommentSubmit }) => {
  const [expanded, setExpanded] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [commenting, setCommenting] = useState(false);

  const isLiked = currentUserId && post.likes.some((like) => like.userId === currentUserId);
  const likesCount = post.likes.length;
  const commentsCount = post.comments.length;

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const handleLike = () => {
    if (!currentUserId) {
      alert('You must be logged in to like posts.');
      return;
    }
    onLikeToggle(post._id);
  };

  const handleCommentPost = async (e) => {
    e.preventDefault();
    if (!currentUserId) {
      alert('You must be logged in to comment.');
      return;
    }
    if (!commentText.trim()) return;

    setCommenting(true);
    try {
      await onCommentSubmit(post._id, commentText);
      setCommentText('');
    } catch (err) {
      console.error(err);
    } finally {
      setCommenting(false);
    }
  };

  const formatTime = (timeStr) => {
    const date = new Date(timeStr);
    return date.toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <Card sx={{ mb: 3 }}>
      <CardHeader
        avatar={
          <Avatar sx={{ bgcolor: 'primary.main' }}>
            {post.username[0].toUpperCase()}
          </Avatar>
        }
        title={post.username}
        subheader={formatTime(post.createdAt)}
        titleTypographyProps={{ fontWeight: 600 }}
      />

      {post.text && (
        <CardContent sx={{ pt: 0 }}>
          <Typography variant="body1" color="text.primary">
            {post.text}
          </Typography>
        </CardContent>
      )}

      {post.image && (
        <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center', bgcolor: 'black', maxHeight: 500, overflow: 'hidden' }}>
          <img
            src={post.image}
            alt="Post content"
            style={{ width: '100%', height: 'auto', objectFit: 'contain', maxHeight: 500 }}
          />
        </Box>
      )}

      <CardActions disableSpacing sx={{ px: 2, py: 1, display: 'flex', justifyContent: 'space-between' }}>
        <Box display="flex" alignItems="center">
          <IconButton onClick={handleLike} color={isLiked ? 'error' : 'default'} disabled={!currentUserId}>
            {isLiked ? <FavoriteIcon /> : <FavoriteBorderIcon />}
          </IconButton>
          <Typography variant="body2" sx={{ ml: 0.5, fontWeight: 600 }}>
            {likesCount} {likesCount === 1 ? 'Like' : 'Likes'}
          </Typography>
        </Box>

        <Box display="flex" alignItems="center">
          <IconButton onClick={handleExpandClick} color="primary">
            <CommentIcon />
          </IconButton>
          <Typography variant="body2" sx={{ ml: 0.5, fontWeight: 600 }}>
            {commentsCount} {commentsCount === 1 ? 'Comment' : 'Comments'}
          </Typography>
        </Box>
      </CardActions>

      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <Divider />
        <CardContent sx={{ bgcolor: 'background.default' }}>
          {currentUserId && (
            <Box component="form" onSubmit={handleCommentPost} display="flex" gap={1} mb={2}>
              <TextField
                fullWidth
                size="small"
                variant="outlined"
                placeholder="Write a comment..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                disabled={commenting}
              />
              <Button
                type="submit"
                variant="contained"
                size="small"
                disabled={!commentText.trim() || commenting}
                endIcon={<SendIcon />}
              >
                Post
              </Button>
            </Box>
          )}

          {post.comments.length > 0 ? (
            <List sx={{ p: 0 }}>
              {post.comments.map((comment, idx) => (
                <Box key={comment._id || idx} sx={{ mb: 1.5, p: 1.5, bgcolor: 'background.paper', borderRadius: 2, border: '1px solid #e2e8f0' }}>
                  <Box display="flex" justifyContent="space-between" mb={0.5}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                      {comment.username}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {formatTime(comment.createdAt)}
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="text.primary">
                    {comment.comment}
                  </Typography>
                </Box>
              ))}
            </List>
          ) : (
            <Typography variant="body2" color="text.secondary" align="center" sx={{ py: 1 }}>
              No comments yet. Be the first to comment!
            </Typography>
          )}
        </CardContent>
      </Collapse>
    </Card>
  );
};

export default PostCard;
