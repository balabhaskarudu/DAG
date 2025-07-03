import Joi from 'joi';
import { ObjectId } from 'mongodb';

// Existing validation schemas...
const nodeSchema = Joi.object({
  id: Joi.string().required(),
  type: Joi.string().default('editableNode'),
  position: Joi.object({
    x: Joi.number().required(),
    y: Joi.number().required(),
  }).required(),
  data: Joi.object({
    label: Joi.string().required(),
  }).required(),
  selected: Joi.boolean().default(false),
});

const edgeSchema = Joi.object({
  id: Joi.string().required(),
  source: Joi.string().required(),
  target: Joi.string().required(),
  selected: Joi.boolean().default(false),
});

const graphSchema = Joi.object({
  name: Joi.string().min(1).max(100).required(),
  description: Joi.string().max(500).allow('').default(''),
  nodes: Joi.array().items(nodeSchema).required(),
  edges: Joi.array().items(edgeSchema).required(),
  metadata: Joi.object({
    nodeCount: Joi.number().min(0),
    edgeCount: Joi.number().min(0),
    lastUpdated: Joi.date(),
  }).optional(),
  tags: Joi.array().items(Joi.string()).default([]),
  isPublic: Joi.boolean().default(false),
});

// New validation schemas for JSONPlaceholder data
const geoSchema = Joi.object({
  lat: Joi.string().required(),
  lng: Joi.string().required(),
});

const addressSchema = Joi.object({
  street: Joi.string().required(),
  suite: Joi.string().required(),
  city: Joi.string().required(),
  zipcode: Joi.string().required(),
  geo: geoSchema.required(),
});

const companySchema = Joi.object({
  name: Joi.string().required(),
  catchPhrase: Joi.string().required(),
  bs: Joi.string().required(),
});

const userSchema = Joi.object({
  id: Joi.number().integer().positive().required(),
  name: Joi.string().min(1).max(100).required(),
  username: Joi.string().min(1).max(50).required(),
  email: Joi.string().email().required(),
  address: addressSchema.required(),
  phone: Joi.string().required(),
  website: Joi.string().required(),
  company: companySchema.required(),
});

const postSchema = Joi.object({
  userId: Joi.number().integer().positive().required(),
  id: Joi.number().integer().positive().required(),
  title: Joi.string().min(1).max(200).required(),
  body: Joi.string().min(1).required(),
});

const commentSchema = Joi.object({
  postId: Joi.number().integer().positive().required(),
  id: Joi.number().integer().positive().required(),
  name: Joi.string().min(1).max(100).required(),
  email: Joi.string().email().required(),
  body: Joi.string().min(1).required(),
});

// Pagination validation
const paginationSchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(10),
  sortBy: Joi.string().valid('id', 'name', 'username', 'email').default('id'),
  order: Joi.string().valid('asc', 'desc').default('asc'),
});

// Export validation functions
export const validateGraph = (data: any) => {
  return graphSchema.validate(data, { abortEarly: false });
};

export const validateNode = (data: any) => {
  return nodeSchema.validate(data, { abortEarly: false });
};

export const validateEdge = (data: any) => {
  return edgeSchema.validate(data, { abortEarly: false });
};

export const validateUser = (data: any) => {
  return userSchema.validate(data, { abortEarly: false });
};

export const validatePost = (data: any) => {
  return postSchema.validate(data, { abortEarly: false });
};

export const validateComment = (data: any) => {
  return commentSchema.validate(data, { abortEarly: false });
};

export const validatePagination = (query: any) => {
  return paginationSchema.validate(query);
};

export const validateObjectId = (id: string): boolean => {
  return ObjectId.isValid(id);
};