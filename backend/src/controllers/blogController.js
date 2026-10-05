import BlogPost from '../models/blogPostModel.js';
import logger from '../utils/logger.js';

function toPublic(post) {
  return post;
}

// GET /api/blog
export async function getPosts(req, res, next) {
  try {
    const { status, category } = req.query;
    let posts;

    if (req.user && status) {
      posts = await BlogPost.findAll({ status });
    } else if (category) {
      posts = await BlogPost.findPublishedWithTag(category);
    } else {
      posts = await BlogPost.findAll({ status: 'published' });
    }

    res.json({ posts: posts.map(toPublic) });
  } catch (err) {
    next(err);
  }
}

// GET /api/blog/:slug
export async function getPost(req, res, next) {
  try {
    const post = await BlogPost.findBySlug(req.params.slug);
    if (!post) return res.status(404).json({ message: 'Post not found' });
    if (post.status !== 'published' && !req.user) {
      return res.status(404).json({ message: 'Post not found' });
    }
    res.json({ post });
  } catch (err) {
    next(err);
  }
}

// GET /api/admin/blog
export async function adminListPosts(req, res, next) {
  try {
    const posts = await BlogPost.findAll({});
    res.json({ posts });
  } catch (err) {
    next(err);
  }
}

// GET /api/admin/blog/:id
export async function adminGetPost(req, res, next) {
  try {
    const post = await BlogPost.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });
    res.json({ post });
  } catch (err) {
    next(err);
  }
}

// POST /api/admin/blog
export async function createPost(req, res, next) {
  try {
    if (!req.body.title || !req.body.slug) {
      return res.status(400).json({ message: 'title and slug are required' });
    }
    const post = await BlogPost.create({
      ...req.body,
      author: req.body.author || `${req.user.first_name} ${req.user.last_name}`,
    });
    logger.info(`Blog post created: ${post.title}`);
    res.status(201).json({ post });
  } catch (err) {
    next(err);
  }
}

// PUT /api/admin/blog/:id
export async function updatePost(req, res, next) {
  try {
    const existing = await BlogPost.findById(req.params.id);
    if (!existing) return res.status(404).json({ message: 'Post not found' });
    const post = await BlogPost.update(existing.id, req.body);
    logger.info(`Blog post updated: ${post.title}`);
    res.json({ post });
  } catch (err) {
    next(err);
  }
}

// DELETE /api/admin/blog/:id
export async function deletePost(req, res, next) {
  try {
    const post = await BlogPost.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });
    await BlogPost.remove(post.id);
    logger.info(`Blog post deleted: ${post.title}`);
    res.json({ message: 'Post deleted' });
  } catch (err) {
    next(err);
  }
}