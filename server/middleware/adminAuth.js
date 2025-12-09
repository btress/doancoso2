const jwt = require('jsonwebtoken');

const adminAuth = (req, res, next) => {
  try {
    const bearer = req.headers.authorization;
    const token = bearer?.startsWith('Bearer ') ? bearer.split(' ')[1] : req.cookies?.adminToken;
    if (!token) return res.status(401).json({ success: false, error: 'Admin authentication required' });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded || !decoded.isAdmin) return res.status(403).json({ success: false, error: 'Admin access required' });

    req.admin = { id: decoded.id };
    next();
  } catch (error) {
    return res.status(401).json({ success: false, error: 'Invalid or expired admin token' });
  }
};

module.exports = adminAuth;
