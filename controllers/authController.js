const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const nodemailer = require('nodemailer');
const User = require('../models/User');

// Email transporter (Gmail)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

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
    if (!username || !email || !password || !phone_number) {
      return res.status(400).json({ message: 'username, email, password, and phone_number are required' });
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

    // Issue email verification token (valid 1 hour)
    const emailToken = jwt.sign(
      { email: user.email },
      process.env.JWT_EMAIL_SECRET || process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
    const verifyLink = `http://localhost:${process.env.PORT}/auth/verify?token=${emailToken}`;

    await transporter.sendMail({
      from: `Verifikasi Akun <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: 'Verifikasi Email Akun Kamu',
      html: `<p>Halo ${user.username}, klik link berikut untuk verifikasi akun kamu:</p>
             <a href="${verifyLink}">${verifyLink}</a>
             <p>(Link berlaku 1 jam)</p>`,
    });

    return res.status(201).json({ message: 'Email verifikasi terkirim! Cek inbox kamu.' });
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
    if (!user.verif_email) {
      return res.status(403).json({ message: 'Silakan verifikasi email terlebih dahulu' });
    }
    const accessToken = signAccessToken(user);
    const refreshToken = signRefreshToken(user);
    await user.update({ refresh_token: refreshToken });
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

async function verifyEmail(req, res, next) {
  try {
    const { token } = req.query || {};
    if (!token) {
      return res.status(400).json({ message: 'Verification token is required' });
    }
    const payload = jwt.verify(token, process.env.JWT_EMAIL_SECRET || process.env.JWT_SECRET);
    const user = await User.findOne({ where: { email: payload.email } });
    if (!user) {
      return res.status(404).send('User tidak ditemukan');
    }
    if (user.verif_email) {
      return res.status(200).send(`<h2>Email ${payload.email} sudah terverifikasi</h2>`);
    }
    await user.update({ verif_email: true });
    return res.status(200).send(`<h2>Email ${payload.email} berhasil diverifikasi 🎉</h2>`);
  } catch (err) {
    return res.status(400).send('Link verifikasi tidak valid atau sudah kadaluarsa');
  }
}

async function resendVerification(req, res, next) {
  try {
    const { email } = req.body || {};
    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    if (user.verif_email) {
      return res.status(400).json({ message: 'Email is already verified' });
    }

    const emailToken = jwt.sign(
      { email: user.email },
      process.env.JWT_EMAIL_SECRET || process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
    const verifyLink = `http://localhost:${process.env.PORT}/auth/verify?token=${emailToken}`;

    await transporter.sendMail({
      from: `Verifikasi Akun <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: 'Verifikasi Email Akun Kamu (Ulang)',
      html: `<p>Halo ${user.username}, ini link verifikasi terbaru:</p>
             <a href="${verifyLink}">${verifyLink}</a>
             <p>(Link berlaku 1 jam)</p>`,
    });

    return res.status(200).json({ message: 'Email verifikasi dikirim ulang. Cek inbox kamu.' });
  } catch (err) {
    next(err);
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

module.exports = { register, login, refresh, listUsers, verifyEmail, resendVerification };
