const jwt = require('jsonwebtoken');
const prisma = require('../config/db.config');

const JWT_SECRET = process.env.JWT_SECRET;

const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    
    let session = await prisma.session.findUnique({
      where: { token },
      include: { user: true }
    });

    if (!session) {
      const user = await prisma.user.findUnique({
        where: { id: decoded.userId }
      });

      if (!user) {
        return res.status(401).json({ error: 'User not found' });
      }

      const expiresAt = new Date(decoded.exp * 1000);
      session = await prisma.session.create({
        data: {
          userId: user.id,
          token,
          expiresAt,
        },
        include: { user: true }
      });
    }

    if (!session.isActive) {
      return res.status(401).json({ error: 'Session expired or invalid' });
    }

    if (new Date() > session.expiresAt) {
      await prisma.session.update({
        where: { id: session.id },
        data: { isActive: false }
      });
      return res.status(401).json({ error: 'Session expired' });
    }

    await prisma.session.update({
      where: { id: session.id },
      data: { lastUsed: new Date() }
    });

    req.user = session.user;
    next();
    
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      console.error('Auth middleware error:', error);
    }
    return res.status(403).json({ error: 'Invalid or expired token' });
  }
};

module.exports = { authenticateToken };
