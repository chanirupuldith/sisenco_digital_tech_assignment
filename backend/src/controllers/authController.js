import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import db from '../config/db.js';

/**
 * Registers a new user.
 * Hashes the password and stores user credentials in the database.
 *
 * @route  POST /api/auth/register
 * @access Public
 */
export const register = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const [existingUser] = await db.execute(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );
    if (existingUser.length > 0) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    await db.execute(
      'INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)',
      [username, email, hashedPassword]
    );

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Authenticates a user and returns a signed JWT token.
 * Compares the provided password against the stored hash.
 *
 * @route  POST /api/auth/login
 * @access Public
 */
export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const [users] = await db.execute('SELECT * FROM users WHERE email = ?', [
      email,
    ]);
    if (users.length === 0) {
      return res.status(400).json({ message: 'Invalid Credentials' });
    }

    const user = users[0];

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid Credentials' });
    }

    const token = jwt.sign(
      { id: user.id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({
      token,
      user: { id: user.id, username: user.username, email: user.email },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};
