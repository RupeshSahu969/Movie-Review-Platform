const jwt = require('jsonwebtoken');

exports.protect = (req, res, next) => {
const auth = req.headers.authorization;
if (!auth || !auth.startsWith('Bearer ')) return res.status(401).json({ message: 'No token provided' });
const token = auth.split(' ')[1];
try {
const decoded = jwt.verify(token, process.env.JWT_SECRET);
req.user = decoded; 
return next();
} catch (err) {
return res.status(401).json({ message: 'Token invalid or expired' });
}
};

exports.admin = (req, res, next) => {
if (req.user && req.user.role === 'admin') return next();
return res.status(403).json({ message: 'Admin only' });
};