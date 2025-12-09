const jwt = require('jsonwebtoken');

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const adminUser = process.env.ADMIN_USER || 'admin';
    const adminPass = process.env.ADMIN_PASS || 'adminpass';

    if (!username || !password) {
      return res.status(400).json({ success: false, error: 'Username and password required' });
    }

    if (username !== adminUser || password !== adminPass) {
      return res.status(401).json({ success: false, error: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: 'admin', isAdmin: true }, process.env.JWT_SECRET, { expiresIn: '12h' });
    res.json({ success: true, data: { token } });
  } catch (error) {
    console.error('Admin login error:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
};
