import React, { useState } from 'react';
import { Card, CardHeader, CardContent, CardActions, Collapse, Avatar, IconButton, Typography, Button, TextField, Box, Divider, List } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import CommentOutlinedIcon from '@mui/icons-material/CommentOutlined';
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
    <Card sx={{ mb: 4, overflow: 'hidden', transition: 'box-shadow 0.3s ease', '&:hover': { boxShadow: '0px 8px 30px rgba(0, 0, 0, 0.06)' } }}>
      <CardHeader
        avatar={
          <Avatar sx={{ bgcolor: 'primary.main', width: 42, height: 42, fontWeight: 700 }}>
            {post.username[0].toUpperCase()}
          </Avatar>
        }
        title={post.username}
        subheader={formatTime(post.createdAt)}
        titleTypographyProps={{ fontWeight: 600, fontSize: '1rem' }}
        subheaderTypographyProps={{ fontSize: '0.8rem', color: 'text.secondary' }}
        sx={{ pb: 1.5 }}
      />

      {post.text && (
        <CardContent sx={{ pt: 0, pb: 2 }}>
          <Typography variant="body1" color="text.primary" sx={{ fontSize: '0.975rem', whiteSpace: 'pre-wrap' }}>
            {post.text}
          </Typography>
        </CardContent>
      )}

      {post.image && (
        <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center', bgcolor: '#f8fafc', borderTop: '1px solid #f1f5f9', borderBottom: '1px solid #f1f5f9', maxHeight: 450, overflow: 'hidden' }}>
          <img
            src={post.image}
            alt="Post content"
            style={{ width: '100%', height: 'auto', objectFit: 'contain', maxHeight: 450 }}
          />
        </Box>
      )}

      {/* Info Stats Bar */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', px: 3, py: 1.5 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              bgcolor: likesCount > 0 ? 'error.light' : 'transparent',
              borderRadius: '50%',
              width: 18,
              height: 18,
              p: 0.2
            }}
          >
            {likesCount > 0 && <FavoriteIcon sx={{ fontSize: 12, color: 'white' }} />}
          </Box>
          <Typography variant="caption" sx={{ fontWeight: 500, color: 'text.secondary' }}>
            {likesCount} {likesCount === 1 ? 'like' : 'likes'}
          </Typography>
        </Box>

        <Typography
          variant="caption"
          onClick={handleExpandClick}
          sx={{ fontWeight: 500, color: 'text.secondary', cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}
        >
          {commentsCount} {commentsCount === 1 ? 'comment' : 'comments'}
        </Typography>
      </Box>

      <Divider sx={{ mx: 2 }} />

      {/* Interactive Action Buttons */}
      <CardActions sx={{ px: 2, py: 0.5, display: 'flex', justifyContent: 'space-between' }}>
        <Button
          fullWidth
          startIcon={isLiked ? <FavoriteIcon /> : <FavoriteBorderIcon />}
          onClick={handleLike}
          color={isLiked ? 'error' : 'inherit'}
          sx={{
            py: 1,
            borderRadius: 2,
            fontWeight: 600,
            fontSize: '0.875rem',
            color: isLiked ? 'error.main' : 'text.secondary',
            '&:hover': { bgcolor: isLiked ? 'error.50' : 'action.hover' }
          }}
        >
          Like
        </Button>

        <Button
          fullWidth
          startIcon={<CommentOutlinedIcon />}
          onClick={handleExpandClick}
          color="inherit"
          sx={{
            py: 1,
            borderRadius: 2,
            fontWeight: 600,
            fontSize: '0.875rem',
            color: expanded ? 'primary.main' : 'text.secondary',
            '&:hover': { bgcolor: 'action.hover' }
          }}
        >
          Comment
        </Button>
      </CardActions>

      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <Divider />
        <CardContent sx={{ bgcolor: '#f8fafc', p: 3 }}>
          {currentUserId && (
            <Box component="form" onSubmit={handleCommentPost} sx={{ display: 'flex', gap: 1.5, mb: 3 }}>
              <Avatar sx={{ bgcolor: 'secondary.main', width: 34, height: 34, fontSize: '0.85rem' }}>
                U
              </Avatar>
              <Box sx={{ display: 'flex', flexGrow: 1, gap: 1 }}>
                <TextField
                  fullWidth
                  size="small"
                  variant="outlined"
                  placeholder="Write a comment..."
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  disabled={commenting}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      bgcolor: 'background.paper',
                      borderRadius: 4
                    }
                  }}
                />
                <Button
                  type="submit"
                  variant="contained"
                  size="small"
                  disabled={!commentText.trim() || commenting}
                  sx={{ borderRadius: 4, px: 2 }}
                >
                  <SendIcon fontSize="small" />
                </Button>
              </Box>
            </Box>
          )}

          {post.comments.length > 0 ? (
            <List sx={{ p: 0, display: 'flex', flexDirection: 'column', gap: 2 }}>
              {post.comments.map((comment, idx) => (
                <Box key={comment._id || idx} sx={{ display: 'flex', gap: 1.5, alignItems: 'flex-start' }}>
                  <Avatar sx={{ bgcolor: 'primary.light', width: 32, height: 32, fontSize: '0.8rem', fontWeight: 600 }}>
                    {comment.username[0].toUpperCase()}
                  </Avatar>
                  <Box
                    sx={{
                      bgcolor: 'background.paper',
                      borderRadius: 3,
                      p: 1.5,
                      border: '1px solid #f1f5f9',
                      maxWidth: '85%',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.02)'
                    }}
                  >
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 2, mb: 0.5 }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 700, fontSize: '0.85rem' }}>
                        {comment.username}
                      </Typography>
                      <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
                        {formatTime(comment.createdAt)}
                      </Typography>
                    </Box>
                    <Typography variant="body2" color="text.primary" sx={{ fontSize: '0.875rem', lineHeight: 1.5 }}>
                      {comment.comment}
                    </Typography>
                  </Box>
                </Box>
              ))}
            </List>
          ) : (
            <Typography variant="body2" color="text.secondary" align="center" sx={{ py: 1, fontSize: '0.85rem' }}>
              No comments yet. Be the first to comment!
            </Typography>
          )}
        </CardContent>
      </Collapse>
    </Card>
  );
};

export default PostCard;
