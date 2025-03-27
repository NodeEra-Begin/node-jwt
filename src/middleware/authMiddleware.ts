import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../config/jwt';

interface AuthenticatedRequest extends Request {
  user?: { id: number };
}

export const authMiddleware = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  const decoded = verifyToken(token);

  if (!decoded) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }

  req.user = decoded as { id: number };
  next();
};