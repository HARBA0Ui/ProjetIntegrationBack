export const requireAdmin = (req, res, next) => {
    if (req.user.type !== 'ADMIN') {
      return res.status(403).json({ message: 'Admin access required' });
    }
    next();
  };
  
  export const requireUser = (req, res, next) => {
    if (req.user.type !== 'USER') {
      return res.status(403).json({ message: 'User access required' });
    }
    next();
  };