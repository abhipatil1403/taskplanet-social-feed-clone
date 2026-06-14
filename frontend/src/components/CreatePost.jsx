import React, { useState } from 'react';
import { Card, CardContent, TextField, Button, Box, IconButton, Typography } from '@mui/material';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import CloseIcon from '@mui/icons-material/Close';

const CreatePost = ({ onPostCreated }) => {
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
    <Card sx={{ mb: 3 }}>
      <CardContent>
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
          Create a Post
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            multiline
            rows={3}
            placeholder="Share something with TaskPlanet..."
            variant="outlined"
            value={text}
            onChange={(e) => setText(e.target.value)}
            disabled={loading}
            sx={{ mb: 2 }}
          />

          {image && (
            <Box sx={{ position: 'relative', mb: 2, display: 'inline-block', maxWidth: '100%' }}>
              <img
                src={image}
                alt="Upload preview"
                style={{ maxHeight: 200, maxWidth: '100%', borderRadius: 8 }}
              />
              <IconButton
                sx={{
                  position: 'absolute',
                  top: 5,
                  right: 5,
                  bgcolor: 'rgba(0, 0, 0, 0.6)',
                  color: 'white',
                  '&:hover': { bgcolor: 'rgba(0, 0, 0, 0.8)' },
                }}
                size="small"
                onClick={removeImage}
              >
                <CloseIcon fontSize="small" />
              </IconButton>
            </Box>
          )}

          {error && (
            <Typography color="error" variant="body2" sx={{ mb: 2 }}>
              {error}
            </Typography>
          )}

          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Button
              component="label"
              variant="text"
              startIcon={<PhotoCamera />}
              disabled={loading}
            >
              Upload Image
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
              disabled={loading || (!text.trim() && !image)}
            >
              {loading ? 'Posting...' : 'Post'}
            </Button>
          </Box>
        </form>
      </CardContent>
    </Card>
  );
};

export default CreatePost;
