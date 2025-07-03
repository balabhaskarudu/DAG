import express from 'express';
import { asyncHandler, createError } from '../middleware/errorHandler';
import { getUserCollection, getPostCollection, getCommentCollection } from '../models/collections';
import { User, UserWithPosts, PaginatedResponse } from '../models/types';
import { validateUser, validatePagination } from '../utils/validation';
import { getUserFromCache, setUserInCache, clearUserFromCache } from '../utils/cache';

const router = express.Router();

// GET /users - Paginated users list
router.get('/', asyncHandler(async (req, res) => {
  const { error, value } = validatePagination(req.query);
  
  if (error) {
    throw createError(`Validation error: ${error.details[0]?.message}`, 400);
  }

  const { page, limit, sortBy, order } = value;
  const skip = (page - 1) * limit;

  const userCollection = getUserCollection();
  
  // Build sort object
  const sortObject: any = {};
  sortObject[sortBy] = order === 'asc' ? 1 : -1;

  // Get total count and paginated data
  const [total, users] = await Promise.all([
    userCollection.countDocuments(),
    userCollection
      .find({})
      .sort(sortObject)
      .skip(skip)
      .limit(limit)
      .toArray()
  ]);

  const pages = Math.ceil(total / limit);

  const response: PaginatedResponse<User> = {
    total,
    page,
    pages,
    limit,
    data: users,
  };

  res.json(response);
}));

// GET /users/:userId - Get user with posts and comments
router.get('/:userId', asyncHandler(async (req, res) => {
  const userId = parseInt(req.params.userId);
  
  if (isNaN(userId)) {
    throw createError('Invalid user ID format', 400);
  }

  // Check cache first
  const cachedUser = getUserFromCache(userId);
  if (cachedUser) {
    console.log(`📋 Cache hit for user ${userId}`);
    return res.json(cachedUser);
  }

  const userCollection = getUserCollection();
  const postCollection = getPostCollection();
  const commentCollection = getCommentCollection();

  // Find user
  const user = await userCollection.findOne({ id: userId });
  
  if (!user) {
    throw createError('User not found', 404);
  }

  // Find user's posts
  const posts = await postCollection.find({ userId }).toArray();

  // Find comments for all posts
  const postIds = posts.map(post => post.id);
  const comments = await commentCollection.find({ 
    postId: { $in: postIds } 
  }).toArray();

  // Group comments by postId
  const commentsByPostId = comments.reduce((acc, comment) => {
    if (!acc[comment.postId]) {
      acc[comment.postId] = [];
    }
    acc[comment.postId].push(comment);
    return acc;
  }, {} as Record<number, typeof comments>);

  // Assemble user with posts and comments
  const userWithPosts: UserWithPosts = {
    ...user,
    posts: posts.map(post => ({
      ...post,
      comments: commentsByPostId[post.id] || []
    }))
  };

  // Cache the result
  setUserInCache(userId, userWithPosts);

  res.json(userWithPosts);
}));

// PUT /users - Create new user
router.put('/', asyncHandler(async (req, res) => {
  const { error, value } = validateUser(req.body);
  
  if (error) {
    throw createError(`Validation error: ${error.details[0]?.message}`, 400);
  }

  const userCollection = getUserCollection();
  
  // Check if user already exists
  const existingUser = await userCollection.findOne({ id: value.id });
  
  if (existingUser) {
    throw createError('User already exists', 400);
  }

  // Insert new user
  await userCollection.insertOne(value);

  // If request includes posts, insert them too
  if (req.body.posts && Array.isArray(req.body.posts)) {
    const postCollection = getPostCollection();
    const postsToInsert = req.body.posts.map((post: any) => ({
      ...post,
      userId: value.id
    }));
    
    if (postsToInsert.length > 0) {
      await postCollection.insertMany(postsToInsert);
    }

    // If posts include comments, insert them too
    const allComments: any[] = [];
    req.body.posts.forEach((post: any) => {
      if (post.comments && Array.isArray(post.comments)) {
        const commentsToInsert = post.comments.map((comment: any) => ({
          ...comment,
          postId: post.id
        }));
        allComments.push(...commentsToInsert);
      }
    });

    if (allComments.length > 0) {
      const commentCollection = getCommentCollection();
      await commentCollection.insertMany(allComments);
    }
  }

  res.status(201).json(value);
}));

// DELETE /users/:userId - Delete specific user
router.delete('/:userId', asyncHandler(async (req, res) => {
  const userId = parseInt(req.params.userId);
  
  if (isNaN(userId)) {
    throw createError('Invalid user ID format', 400);
  }

  const userCollection = getUserCollection();
  const postCollection = getPostCollection();
  const commentCollection = getCommentCollection();

  // Check if user exists
  const user = await userCollection.findOne({ id: userId });
  
  if (!user) {
    throw createError('User not found', 404);
  }

  // Get user's posts to find comments to delete
  const userPosts = await postCollection.find({ userId }).toArray();
  const postIds = userPosts.map(post => post.id);

  // Delete user, their posts, and comments
  await Promise.all([
    userCollection.deleteOne({ id: userId }),
    postCollection.deleteMany({ userId }),
    commentCollection.deleteMany({ postId: { $in: postIds } })
  ]);

  // Clear from cache
  clearUserFromCache(userId);

  res.json({ 
    message: 'User deleted',
    deletedCounts: {
      users: 1,
      posts: userPosts.length,
      comments: await commentCollection.countDocuments({ postId: { $in: postIds } })
    }
  });
}));

// DELETE /users - Delete all users, posts, and comments
router.delete('/', asyncHandler(async (req, res) => {
  const userCollection = getUserCollection();
  const postCollection = getPostCollection();
  const commentCollection = getCommentCollection();

  // Get counts before deletion
  const [userCount, postCount, commentCount] = await Promise.all([
    userCollection.countDocuments(),
    postCollection.countDocuments(),
    commentCollection.countDocuments()
  ]);

  // Delete all data
  await Promise.all([
    userCollection.deleteMany({}),
    postCollection.deleteMany({}),
    commentCollection.deleteMany({})
  ]);

  res.json({ 
    message: 'All users deleted',
    deletedCounts: {
      users: userCount,
      posts: postCount,
      comments: commentCount
    }
  });
}));

export default router;