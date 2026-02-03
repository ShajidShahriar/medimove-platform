import express, { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User';

const router = express.Router();

// LOGIN ROUTE
router.post('/login', async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;

    // 1. Check if user exists
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ message: 'Invalid Credentials' });
    }

    // 2. Check Password (Compare the sent password with the hashed one)
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid Credentials' });
    }

    // 3. Create the Token (The "Badge")
    const secret = process.env.JWT_SECRET || 'secret';
    const token = jwt.sign({ id: user._id }, secret, { expiresIn: '1d' }); // Valid for 1 day

    res.json({ token, username: user.username });

  } catch (err) {
    res.status(500).json({ message: 'Server Error' });
  }
});

export default router;