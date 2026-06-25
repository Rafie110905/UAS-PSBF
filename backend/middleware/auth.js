const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'rahasia_jwt_sangat_aman_2024';

const authenticate = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ message: 'Token tidak ditemukan. Silakan login.' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token kadaluarsa. Silakan login ulang.' });
    }
    return res.status(403).json({ message: 'Token tidak valid.' });
  }
};

module.exports = { authenticate, JWT_SECRET };
