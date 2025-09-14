const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { registerSchema, loginSchema } = require('../utils/validate');

const signToken = (user) =>
  jwt.sign(
    { id: user._id, role: user.role, username: user.username, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: process.env.TOKEN_EXPIRES_IN || '7d' }
  );

exports.register = async (req, res) => {
  try {
    const { error, value } = registerSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.message });

    const { username, email, password, adminCode } = value;

    if (await User.findOne({ email }))
      return res.status(400).json({ message: 'Email already registered' });

    const role =
      adminCode && adminCode === process.env.ADMIN_CODE ? 'admin' : 'user';


    let profilePicture = '';
    if (req.file) {
      profilePicture = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
    }

    const user = await User.create({
      username,
      email,
      password,
      role,
    });

    const token = signToken(user);
  res.status(201).json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        joinDate: user.joinDate,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
};

exports.login = async (req, res) => {
  try {
    const { error, value } = loginSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.message });

    const { email, password } = value;
    const user = await User.findOne({ email }).select('+password');
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const ok = await user.matchPassword(password);
    if (!ok) return res.status(400).json({ message: 'Invalid credentials' });

    const token = signToken(user);

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        profilePicture: user.profilePicture,
        joinDate: user.joinDate,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
};
