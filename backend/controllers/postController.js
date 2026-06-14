const Post = require('../models/Post');

// @desc    Get all posts (sorted by latest first)
// @route   GET /api/posts
// @access  Public
const getPosts = async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 });
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: error.message || 'Server Error' });
  }
};

// @desc    Create a new post
// @route   POST /api/posts
// @access  Private
const createPost = async (req, res) => {
  const { text, image } = req.body;

  if (!text && !image) {
    return res.status(400).json({ message: 'At least text or an image is required to post' });
  }

  try {
    const post = await Post.create({
      userId: req.user._id,
      username: req.user.username,
      text: text || '',
      image: image || '',
      likes: [],
      comments: [],
    });

    res.status(201).json(post);
  } catch (error) {
    res.status(500).json({ message: error.message || 'Server Error' });
  }
};

// @desc    Toggle like / unlike a post
// @route   PUT /api/posts/:id/like
// @access  Private
const toggleLike = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Check if user already liked
    const alreadyLikedIdx = post.likes.findIndex(
      (like) => like.userId.toString() === req.user._id.toString()
    );

    if (alreadyLikedIdx > -1) {
      // Unlike (remove like)
      post.likes.splice(alreadyLikedIdx, 1);
    } else {
      // Like (add like)
      post.likes.push({
        userId: req.user._id,
        username: req.user.username,
      });
    }

    await post.save();
    res.json(post);
  } catch (error) {
    res.status(500).json({ message: error.message || 'Server Error' });
  }
};

// @desc    Add a comment to a post
// @route   POST /api/posts/:id/comment
// @access  Private
const addComment = async (req, res) => {
  const { comment } = req.body;

  if (!comment || comment.trim() === '') {
    return res.status(400).json({ message: 'Comment text is required' });
  }

  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const newComment = {
      userId: req.user._id,
      username: req.user.username,
      comment: comment.trim(),
      createdAt: new Date(),
    };

    post.comments.push(newComment);
    await post.save();

    res.status(201).json(post);
  } catch (error) {
    res.status(500).json({ message: error.message || 'Server Error' });
  }
};

module.exports = {
  getPosts,
  createPost,
  toggleLike,
  addComment,
};
