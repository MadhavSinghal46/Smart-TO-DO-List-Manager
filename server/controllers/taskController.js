import mongoose from 'mongoose';
import { validationResult } from 'express-validator';
import Task from '../models/Task.js';

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

const findOwnedTask = async (taskId, userId) => {
  if (!isValidObjectId(taskId)) return null;
  return Task.findOne({ _id: taskId, userId });
};

export const getTasks = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const tasks = await Task.find({ userId }).sort({ createdAt: -1 });

    const pending = tasks.filter((t) => t.status === 'Pending');
    const completed = tasks.filter((t) => t.status === 'Completed');

    res.status(200).json({
      success: true,
      pending,
      completed,
    });
  } catch (error) {
    next(error);
  }
};

export const createTask = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed.',
        errors: errors.array().map((e) => e.msg),
      });
    }

    const { title, description } = req.body;

    const task = await Task.create({
      userId: req.user.userId,
      title: title.trim(),
      description: description?.trim() || '',
      status: 'Pending',
      completedAt: null,
    });

    res.status(201).json({ success: true, task });
  } catch (error) {
    next(error);
  }
};

export const updateTask = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed.',
        errors: errors.array().map((e) => e.msg),
      });
    }

    const task = await findOwnedTask(req.params.id, req.user.userId);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found.',
        errors: [],
      });
    }

    if (task.status === 'Completed') {
      return res.status(400).json({
        success: false,
        message: 'Completed tasks cannot be edited.',
        errors: [],
      });
    }

    const { title, description } = req.body;

    if (title !== undefined) task.title = title.trim();
    if (description !== undefined) task.description = description.trim();

    await task.save();

    res.status(200).json({ success: true, task });
  } catch (error) {
    next(error);
  }
};

export const completeTask = async (req, res, next) => {
  try {
    const task = await findOwnedTask(req.params.id, req.user.userId);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found.',
        errors: [],
      });
    }

    if (task.status === 'Completed') {
      return res.status(400).json({
        success: false,
        message: 'Task is already completed.',
        errors: [],
      });
    }

    task.status = 'Completed';
    task.completedAt = new Date();
    await task.save();

    res.status(200).json({ success: true, task });
  } catch (error) {
    next(error);
  }
};

export const deleteTask = async (req, res, next) => {
  try {
    const task = await findOwnedTask(req.params.id, req.user.userId);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found.',
        errors: [],
      });
    }

    await task.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Task deleted successfully.',
    });
  } catch (error) {
    next(error);
  }
};
