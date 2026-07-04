import { Request, Response, NextFunction } from 'express';
import { UserRepository } from '../db/user.repository';

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    name: string;
  };
}

export const authMiddleware = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  // Try to find custom user in headers or session, else fallback to standard seed user
  const authHeader = req.headers.authorization;
  let userId = 'user-123'; // Default seed user for bulletproof offline/direct preview experience

  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    if (token && token !== 'null' && token !== 'undefined') {
      userId = token; // Treat the token as the userId for simple stateless auth
    }
  }

  const user = UserRepository.getById(userId);
  if (user) {
    req.user = {
      id: user.id,
      email: user.email,
      name: user.name
    };
    next();
  } else {
    res.status(401).json({ error: 'Unauthorized. User not found.' });
  }
};
