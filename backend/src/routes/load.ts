import express from 'express';
import { asyncHandler } from '../middleware/errorHandler';
import { getUserCollection, getPostCollection, getCommentCollection } from '../models/collections';
import { User, Post, Comment } from '../models/types';

const router = express.Router();

interface JSONPlaceholderUser extends User {}
interface JSONPlaceholderPost extends Post {}
interface JSONPlaceholderComment extends Comment {}

router.get('/', asyncHandler(async (req, res) => {
  try {
    console.log('🔄 Starting data load from JSONPlaceholder...');

    // Fetch 10 users from JSONPlaceholder
    const usersResponse = await fetch('https://jsonplaceholder.typicode.com/users');
    if (!usersResponse.ok) {
      throw new Error(`Failed to fetch users: ${usersResponse.statusText}`);
    }
    const users: JSONPlaceholderUser[] = await usersResponse.json();
    const limitedUsers = users.slice(0, 10);

    console.log(`📥 Fetched ${limitedUsers.length} users`);

    // Fetch posts and comments for each user
    const allPosts: JSONPlaceholderPost[] = [];
    const allComments: JSONPlaceholderComment[] = [];

    for (const user of limitedUsers) {
      // Fetch posts for this user
      const postsResponse = await fetch(`https://jsonplaceholder.typicode.com/posts?userId=${user.id}`);
      if (postsResponse.ok) {
        const userPosts: JSONPlaceholderPost[] = await postsResponse.json();
        allPosts.push(...userPosts);

        // Fetch comments for each post
        for (const post of userPosts) {
          const commentsResponse = await fetch(`https://jsonplaceholder.typicode.com/comments?postId=${post.id}`);
          if (commentsResponse.ok) {
            const postComments: JSONPlaceholderComment[] = await commentsResponse.json();
            allComments.push(...postComments);
          }
        }
      }
    }

    console.log(`📥 Fetched ${allPosts.length} posts and ${allComments.length} comments`);

    // Get collections
    const userCollection = getUserCollection();
    const postCollection = getPostCollection();
    const commentCollection = getCommentCollection();

    // Clear existing data
    await Promise.all([
      userCollection.deleteMany({}),
      postCollection.deleteMany({}),
      commentCollection.deleteMany({})
    ]);

    // Insert data into collections
    const insertPromises = [];

    if (limitedUsers.length > 0) {
      insertPromises.push(userCollection.insertMany(limitedUsers));
    }

    if (allPosts.length > 0) {
      insertPromises.push(postCollection.insertMany(allPosts));
    }

    if (allComments.length > 0) {
      insertPromises.push(commentCollection.insertMany(allComments));
    }

    await Promise.all(insertPromises);

    console.log('✅ Data loaded successfully');

    res.json({
      message: 'Data loaded',
      stats: {
        users: limitedUsers.length,
        posts: allPosts.length,
        comments: allComments.length
      }
    });

  } catch (error) {
    console.error('❌ Error loading data:', error);
    throw error;
  }
}));

export default router;