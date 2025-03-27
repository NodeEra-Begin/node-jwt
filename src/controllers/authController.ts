import { Request, Response } from 'express';
import { UserModel } from '../models/User';
import { generateToken } from '../config/jwt';

export const register = async (req: Request, res: Response) => {
  try {
    const { username, email, password } = req.body;

    // Check if user already exists
    const existingUser = await UserModel.findByEmail(email);
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create new user
    const user = await UserModel.create({ 
      username, 
      email, 
      password 
    });

    // Generate JWT token
    const token = generateToken(user.id!);

    res.status(201).json({ 
      message: 'User registered successfully', 
      user: { 
        id: user.id, 
        username: user.username, 
        email: user.email 
      },
      token 
    });
  } catch (error) {
    res.status(500).json({ message: 'Registration failed', error: error });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Validate user credentials
    const user = await UserModel.validatePassword(email, password);
    
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = generateToken(user.id!);

    res.json({ 
      message: 'Login successful', 
      user: { 
        id: user.id, 
        username: user.username, 
        email: user.email 
      },
      token 
    });
  } catch (error) {
    res.status(500).json({ message: 'Login failed', error: error });
  }
};