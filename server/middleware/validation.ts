import { Request, Response, NextFunction } from 'express';

export const validateBody = (fields: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const missing = fields.filter(field => req.body[field] === undefined || req.body[field] === '');
    if (missing.length > 0) {
       res.status(400).json({ 
        error: `Missing required fields: ${missing.join(', ')}` 
      });
       return;
    }
    next();
  };
};
