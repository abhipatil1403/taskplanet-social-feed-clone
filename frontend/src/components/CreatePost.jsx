import React, { useState } from 'react';
import { Card, CardContent, TextField, Button, Box, IconButton, Typography, Avatar, Divider } from '@mui/material';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import CloseIcon from '@mui/icons-material/Close';

const CreatePost = ({ onPostCreated, username }) => {
  const [text, setText] = useState('');
  const [image, setImage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError('Image size should be less than 5MB');
        return;
      }
      setError('');
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImage('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim() && !image) {
      setError('Please add either text or an image to post');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await onPostCreated({ text, image });
      setText('');
      setImage('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create post');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card sx={{ mb: 4, borderRadius: 4, boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.02)', border: '1px solid #f1f5f9' }}>
      <CardContent sx={{ p: 3, '&:last-child': { pb: 3 } }}>
        <Box display="flex" gap={2} alignItems="flex-start" mb={2}>
          <Avatar sx={{ bgcolor: 'primary.main', width: 40, height: 40, fontWeight: 700 }}>
            {username ? username[0].toUpperCase() : 'U'}
          </Avatar>
          <TextField
            fullWidth
            multiline
            rows={2}
            placeholder="What's on your mind? Share text or upload an image..."
            variant="standard"
            InputProps={{
              disableUnderline: true,
              style: { fontSize: '1.05rem' }
            }}
            value={text}
            onChange={(e) => setText(e.target.value)}
            disabled={loading}
          />
        </Box>

        {image && (
          <Box sx={{ position: 'relative', mt: 1, mb: 2, display: 'inline-block', maxWidth: '100%', borderRadius: 3, overflow: 'hidden', border: '1px solid #e2e8f0' }}>
            <img
              src={image}
              alt="Upload preview"
              style={{ maxHeight: 220, maxWidth: '100%', display: 'block', objectFit: 'cover' }}
            />
            <IconButton
              sx={{
                position: 'absolute',
                top: 8,
                right: 8,
                bgcolor: 'rgba(15, 23, 42, 0.75)',
                color: 'white',
                '&:hover': { bgcolor: 'rgba(15, 23, 42, 0.9)' },
              }}
              size="small"
              onClick={removeImage}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          </Box>
        )}

        {error && (
          <Typography color="error" variant="body2" sx={{ mb: 2, fontWeight: 500 }}>
            {error}
          </Typography>
        )}

        <Divider sx={{ my: 1.5, borderColor: '#f1f5f9' }} />

        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Button
            component="label"
            variant="text"
            startIcon={<PhotoCamera sx={{ color: 'secondary.main' }} />}
            disabled={loading}
            sx={{
              color: 'text.secondary',
              fontWeight: 600,
              fontSize: '0.875rem',
              borderRadius: 3,
              px: 2,
              py: 0.75,
              '&:hover': { bgcolor: 'action.hover' }
            }}
          >
            Photo
            <input
              type="file"
              hidden
              accept="image/*"
              onChange={handleImageChange}
            />
          </Button>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            onClick={handleSubmit}
            disabled={loading || (!text.trim() && !image)}
            sx={{
              borderRadius: 3,
              px: 3,
              py: 0.75,
              fontWeight: 700,
              boxShadow: 'none',
              '&:hover': { boxShadow: 'none' }
            }}
          >
            {loading ? 'Posting...' : 'Post'}
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default CreatePost;
