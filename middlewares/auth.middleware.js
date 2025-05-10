import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const authenticate = async (req, res, next) => {
  
  const authHeader = req.headers.authorization;
  const token = authHeader?.split(' ')[1]; 

  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    
    const user = await prisma.utilisateur.findUnique({
      where: { id: decoded.id },
      select: { id: true, nom: true, email: true, type: true },
    });

    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    
    req.user = user;
    next();

  } catch (error) {
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expired' });
    }
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Invalid token' });
    }
    res.status(500).json({ message: 'Authentication failed' });
  }
};