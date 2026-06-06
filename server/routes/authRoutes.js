import express from 'express';
import { body } from 'express-validator';
import { login } from '../controllers/authController.js';

const router = express.Router();

router.post(
  '/login',
  [
    body('name')
      .trim()
      .notEmpty()
      .withMessage('Name is required.')
      .isLength({ min: 2, max: 50 })
      .withMessage('Name must be between 2 and 50 characters.'),
    body('email')
      .trim()
      .notEmpty()
      .withMessage('Email is required.')
      .isEmail()
      .withMessage('Please provide a valid email.')
      .normalizeEmail(),
  ],
  login
);

export default router;
