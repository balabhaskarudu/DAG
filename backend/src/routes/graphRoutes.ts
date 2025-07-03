import express from 'express';
import { ObjectId } from 'mongodb';
import { getDatabase } from '../config/database';
import { asyncHandler, createError } from '../middleware/errorHandler';
import { validateGraph, validateObjectId } from '../utils/validation';

const router = express.Router();

// Get all graphs
router.get('/', asyncHandler(async (req, res) => {
  const db = getDatabase();
  const collection = db.collection('graphs');
  
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const skip = (page - 1) * limit;

  const graphs = await collection
    .find({})
    .sort({ updatedAt: -1 })
    .skip(skip)
    .limit(limit)
    .toArray();

  const total = await collection.countDocuments();

  res.json({
    success: true,
    data: {
      graphs,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    },
  });
}));

// Get graph by ID
router.get('/:id', asyncHandler(async (req, res) => {
  const { id } = req.params;
  
  if (!validateObjectId(id)) {
    throw createError('Invalid graph ID format', 400);
  }

  const db = getDatabase();
  const collection = db.collection('graphs');
  
  const graph = await collection.findOne({ _id: new ObjectId(id) });
  
  if (!graph) {
    throw createError('Graph not found', 404);
  }

  res.json({
    success: true,
    data: graph,
  });
}));

// Create new graph
router.post('/', asyncHandler(async (req, res) => {
  const { error, value } = validateGraph(req.body);
  
  if (error) {
    throw createError(`Validation error: ${error.details[0]?.message}`, 400);
  }

  const db = getDatabase();
  const collection = db.collection('graphs');
  
  const graphData = {
    ...value,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const result = await collection.insertOne(graphData);
  
  const newGraph = await collection.findOne({ _id: result.insertedId });

  res.status(201).json({
    success: true,
    data: newGraph,
    message: 'Graph created successfully',
  });
}));

// Update graph
router.put('/:id', asyncHandler(async (req, res) => {
  const { id } = req.params;
  
  if (!validateObjectId(id)) {
    throw createError('Invalid graph ID format', 400);
  }

  const { error, value } = validateGraph(req.body);
  
  if (error) {
    throw createError(`Validation error: ${error.details[0]?.message}`, 400);
  }

  const db = getDatabase();
  const collection = db.collection('graphs');
  
  const updateData = {
    ...value,
    updatedAt: new Date(),
  };

  const result = await collection.findOneAndUpdate(
    { _id: new ObjectId(id) },
    { $set: updateData },
    { returnDocument: 'after' }
  );

  if (!result.value) {
    throw createError('Graph not found', 404);
  }

  res.json({
    success: true,
    data: result.value,
    message: 'Graph updated successfully',
  });
}));

// Delete graph
router.delete('/:id', asyncHandler(async (req, res) => {
  const { id } = req.params;
  
  if (!validateObjectId(id)) {
    throw createError('Invalid graph ID format', 400);
  }

  const db = getDatabase();
  const collection = db.collection('graphs');
  
  const result = await collection.deleteOne({ _id: new ObjectId(id) });
  
  if (result.deletedCount === 0) {
    throw createError('Graph not found', 404);
  }

  res.json({
    success: true,
    message: 'Graph deleted successfully',
  });
}));

// Duplicate graph
router.post('/:id/duplicate', asyncHandler(async (req, res) => {
  const { id } = req.params;
  
  if (!validateObjectId(id)) {
    throw createError('Invalid graph ID format', 400);
  }

  const db = getDatabase();
  const collection = db.collection('graphs');
  
  const originalGraph = await collection.findOne({ _id: new ObjectId(id) });
  
  if (!originalGraph) {
    throw createError('Graph not found', 404);
  }

  const duplicatedGraph = {
    ...originalGraph,
    _id: undefined,
    name: `${originalGraph.name} (Copy)`,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const result = await collection.insertOne(duplicatedGraph);
  const newGraph = await collection.findOne({ _id: result.insertedId });

  res.status(201).json({
    success: true,
    data: newGraph,
    message: 'Graph duplicated successfully',
  });
}));

export default router;