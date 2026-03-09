import { Router } from 'express';
import { body, validationResult } from 'express-validator';
import { register, login } from '../controllers/authController.js';

const router = Router();

/**
 * Validates request fields and returns 400 with errors if any validation fails.
 */
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

/**
 * @route  POST /api/auth/register
 * @desc   Register a new user account
 * @access Public
 */
router.post(
  '/register',
  [
    body('username').notEmpty().withMessage('Username is required').trim(),
    body('email')
      .isEmail()
      .withMessage('Please include a valid email')
      .normalizeEmail(),
    body('password')
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters long'),
  ],
  validate,
  register
);

/**
 * @route  POST /api/auth/login
 * @desc   Authenticate user and return a JWT token
 * @access Public
 */
router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Please include a valid email'),
    body('password').exists().withMessage('Password is required'),
  ],
  validate,
  login
);

export default router;
