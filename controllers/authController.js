const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const User = require('../models/User');

function signAccessToken(user) {
  return jwt.sign(
    { sub: user.uuid, email: user.email, username: user.username },
    process.env.JWT_ACCESS_SECRET,
    { expiresIn: '15m' }
  );
}

function signRefreshToken(user) {
  return jwt.sign(
    { sub: user.uuid },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: '7d' }
  );
}

async function register(req, res, next) {
  try {
    const { username, email, password, gender, phone_number } = req.body || {};
    if (!username || !email || !password || !gender || !phone_number) {
      return res.status(400).json({ message: 'username, email, password, gender, and phone_number are required' });
    }

    const existingByEmail = await User.findOne({ where: { email } });
    if (existingByEmail) {
      return res.status(409).json({ message: 'email already registered' });
    }

    const existingByUsername = await User.findOne({ where: { username } });
    if (existingByUsername) {
      return res.status(409).json({ message: 'username already taken' });
    }

    const uuid = uuidv4();
    const user = await User.create({ uuid, username, email, password, gender, phone_number });
    const accessToken = signAccessToken(user);
    const refreshToken = signRefreshToken(user);
    return res.status(201).json({ uuid: user.uuid, username: user.username, email: user.email, accessToken, refreshToken });
  } catch (err) {
    next(err);
  }
}

async function login(req, res, next) {
  try {
    const { email, password } = req.body || {};
    if (!email || !password) {
      return res.status(400).json({ message: 'email and password are required' });
    }
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ message: 'invalid credentials' });
    }
    const valid = await user.validatePassword(password);
    if (!valid) {
      return res.status(401).json({ message: 'invalid credentials' });
    }
    const accessToken = signAccessToken(user);
    const refreshToken = signRefreshToken(user);
    return res.json({ uuid: user.uuid, username: user.username, email: user.email, accessToken, refreshToken });
  } catch (err) {
    next(err);
  }
}

async function refresh(req, res) {
  const { refreshToken } = req.body || {};
  if (!refreshToken) {
    return res.status(400).json({ message: 'refreshToken is required' });
  }
  try {
    const payload = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const user = await User.findOne({ where: { uuid: payload.sub } });
    if (!user) {
      return res.status(401).json({ message: 'invalid refresh token' });
    }
    const accessToken = signAccessToken(user);
    return res.json({ accessToken });
  } catch (err) {
    return res.status(401).json({ message: 'invalid refresh token' });
  }
}

async function listUsers(req, res, next) {
  try {
    const users = await User.findAll({ attributes: ['uuid', 'username', 'email'] });
    res.json(users);
  } catch (err) {
    next(err);
  }
}

module.exports = { register, login, refresh, listUsers };
