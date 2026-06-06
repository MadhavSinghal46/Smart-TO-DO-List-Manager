import express from 'express';
import { body } from 'express-validator';
import authMiddleware from '../middleware/authMiddleware.js';
import {
  getTasks,
  createTask,
  updateTask,
  completeTask,
  deleteTask,
} from '../controllers/taskController.js';

const router = express.Router();

const taskValidation = [
  body('title')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Title cannot be empty.')
    .isLength({ max: 200 })
    .withMessage('Title cannot exceed 200 characters.'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Description cannot exceed 1000 characters.'),
];

const createTaskValidation = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Title is required.')
    .isLength({ max: 200 })
    .withMessage('Title cannot exceed 200 characters.'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Description cannot exceed 1000 characters.'),
];

router.use(authMiddleware);

router.get('/', getTasks);
router.post('/', createTaskValidation, createTask);
router.put('/:id', taskValidation, updateTask);
router.put('/:id/complete', completeTask);
router.delete('/:id', deleteTask);

export default router;
