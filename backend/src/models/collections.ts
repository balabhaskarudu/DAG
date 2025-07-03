import { Collection } from 'mongodb';
import { getDb } from '../db';
import { User, Post, Comment } from './types';

export const getUserCollection = (): Collection<User> => {
  return getDb().collection<User>('users');
};

export const getPostCollection = (): Collection<Post> => {
  return getDb().collection<Post>('posts');
};

export const getCommentCollection = (): Collection<Comment> => {
  return getDb().collection<Comment>('comments');
};