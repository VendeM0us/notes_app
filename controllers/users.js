import bcrypt from 'bcrypt';
import express from 'express';
import User from '../models/user.js';

const usersRouter = express.Router();

usersRouter.get('/', async (req, res) => {
  const users = await User.find({}).populate('notes', { content: 1, date: 1 });
  res.json(users);
});

usersRouter.post('/', async (req, res) => {
  const { username, name, password } = req.body;

  const isStrongPassword = /^.{8,}$/.test(password);
  if (!isStrongPassword) {
    return res.status(400).json({
      error: 'password must be at least 8 characters long',
    });
  }

  const existingUser = await User.findOne({ username });
  if (existingUser) {
    return res.status(400).json({
      error: 'username must be unique',
    });
  }

  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(password, saltRounds);

  const user = new User({
    username,
    name,
    passwordHash,
  });

  const savedUser = await user.save();
  res.status(201).json(savedUser);
});

export default usersRouter;
