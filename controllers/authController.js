const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");
const nodemailer = require("nodemailer");
const multer = require("multer");
const cloudinary = require("../config/cloudinary");
const User = require("../models/User");

// Email transporter (Gmail)
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Multer in-memory storage for single file 'profile_pict'
const upload = multer({ storage: multer.memoryStorage() });

async function updateProfile(req, res, next) {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const user = await User.findOne({ where: { uuid: userId } });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const { username, email, password, gender, base_location, phone_number } =
      req.body || {};

    let profileUrl = user.profile_pict;
    const fileObj =
      req.file ||
      (Array.isArray(req.files) && req.files.length > 0 ? req.files[0] : null);
    if (fileObj) {
      // Upload buffer to Cloudinary
      const uploadResult = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "profiles" },
          (err, result) => {
            if (err) return reject(err);
            resolve(result);
          }
        );
        stream.end(fileObj.buffer);
      });
      profileUrl = uploadResult.secure_url;
    }

    const updateData = {};
    if (username) updateData.username = username;
    if (email) updateData.email = email;
    if (password) updateData.password = password; // will be hashed by hooks
    if (gender) updateData.gender = gender;
    if (typeof base_location !== "undefined") {
      try {
        updateData.base_location = Array.isArray(base_location)
          ? base_location
          : JSON.parse(base_location);
      } catch (_) {
        return res
          .status(400)
          .json({ message: "base_location must be an array of strings" });
      }
    }
    if (phone_number) updateData.phone_number = phone_number;
    if (profileUrl) updateData.profile_pict = profileUrl;

    await user.update(updateData);
    return res.json({
      message: "Profile updated",
      user: {
        uuid: user.uuid,
        username: user.username,
        email: user.email,
        gender: user.gender,
        base_location: user.base_location,
        profile_pict: user.profile_pict,
        phone_number: user.phone_number,
      },
    });
  } catch (err) {
    next(err);
  }
}

function signAccessToken(user) {
  return jwt.sign(
    { sub: user.uuid, email: user.email, username: user.username },
    process.env.JWT_ACCESS_SECRET,
    { expiresIn: "15m" }
  );
}

function signRefreshToken(user) {
  return jwt.sign({ sub: user.uuid }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: "7d",
  });
}

async function register(req, res, next) {
  try {
    const { username, email, password, gender, phone_number } = req.body || {};
    if (!username || !email || !password || !phone_number) {
      return res
        .status(400)
        .json({
          message: "username, email, password, and phone_number are required",
        });
    }

    const existingByEmail = await User.findOne({ where: { email } });
    if (existingByEmail) {
      return res.status(409).json({ message: "email already registered" });
    }

    const existingByUsername = await User.findOne({ where: { username } });
    if (existingByUsername) {
      return res.status(409).json({ message: "username already taken" });
    }

    const uuid = uuidv4();
    const user = await User.create({
      uuid,
      username,
      email,
      password,
      gender,
      phone_number,
    });

    // Issue email verification token (valid 1 hour)
    const emailToken = jwt.sign(
      { email: user.email },
      process.env.JWT_EMAIL_SECRET || process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    const verifyLink = `http://localhost:${process.env.PORT}/auth/verify?token=${emailToken}`;

    await transporter.sendMail({
      from: `Verifikasi Akun <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: "Verifikasi Email Akun Kamu",
      html: `<p>Halo ${user.username}, klik link berikut untuk verifikasi akun kamu:</p>
             <a href="${verifyLink}">${verifyLink}</a>
             <p>(Link berlaku 1 jam)</p>`,
    });

    return res
      .status(201)
      .json({ message: "Email verifikasi terkirim! Cek inbox kamu." });
  } catch (err) {
    next(err);
  }
}

async function login(req, res, next) {
  try {
    const { email, password } = req.body || {};
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "email and password are required" });
    }
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ message: "invalid credentials" });
    }
    const valid = await user.validatePassword(password);
    if (!valid) {
      return res.status(401).json({ message: "invalid credentials" });
    }
    if (!user.verif_email) {
      return res
        .status(403)
        .json({ message: "Silakan verifikasi email terlebih dahulu" });
    }
    const accessToken = signAccessToken(user);
    const refreshToken = signRefreshToken(user);
    await user.update({ refresh_token: refreshToken });
    return res.json({
      uuid: user.uuid,
      username: user.username,
      email: user.email,
      accessToken,
      refreshToken,
    });
  } catch (err) {
    next(err);
  }
}

async function refresh(req, res) {
  const { refreshToken } = req.body || {};
  if (!refreshToken) {
    return res.status(400).json({ message: "refreshToken is required" });
  }
  try {
    const payload = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const user = await User.findOne({ where: { uuid: payload.sub } });
    if (!user) {
      return res.status(401).json({ message: "invalid refresh token" });
    }
    const accessToken = signAccessToken(user);
    return res.json({ accessToken });
  } catch (err) {
    return res.status(401).json({ message: "invalid refresh token" });
  }
}

async function verifyEmail(req, res, next) {
  try {
    const { token } = req.query || {};
    if (!token) {
      return res
        .status(400)
        .json({ message: "Verification token is required" });
    }
    const payload = jwt.verify(
      token,
      process.env.JWT_EMAIL_SECRET || process.env.JWT_SECRET
    );
    const user = await User.findOne({ where: { email: payload.email } });
    if (!user) {
      return res.status(404).send("User tidak ditemukan");
    }
    if (user.verif_email) {
      return res
        .status(200)
        .send(`<h2>Email ${payload.email} sudah terverifikasi</h2>`);
    }
    await user.update({ verif_email: true });
    return res
      .status(200)
      .send(`<h2>Email ${payload.email} berhasil diverifikasi 🎉</h2>`);
  } catch (err) {
    return res
      .status(400)
      .send("Link verifikasi tidak valid atau sudah kadaluarsa");
  }
}

async function resendVerification(req, res, next) {
  try {
    const { email } = req.body || {};
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (user.verif_email) {
      return res.status(400).json({ message: "Email is already verified" });
    }

    const emailToken = jwt.sign(
      { email: user.email },
      process.env.JWT_EMAIL_SECRET || process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    const verifyLink = `http://localhost:${process.env.PORT}/auth/verify?token=${emailToken}`;

    await transporter.sendMail({
      from: `Verifikasi Akun <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: "Verifikasi Email Akun Kamu (Ulang)",
      html: `<p>Halo ${user.username}, ini link verifikasi terbaru:</p>
             <a href="${verifyLink}">${verifyLink}</a>
             <p>(Link berlaku 1 jam)</p>`,
    });

    return res
      .status(200)
      .json({ message: "Email verifikasi dikirim ulang. Cek inbox kamu." });
  } catch (err) {
    next(err);
  }
}

async function listUsers(req, res, next) {
  try {
    const users = await User.findAll({
      attributes: ["uuid", "username", "email"],
    });
    res.json(users);
  } catch (err) {
    next(err);
  }
}


async function reverseGeocode(req, res) {
  try {
    const { lat, lon } = req.query || {};
    if (!lat || !lon) {
      return res.status(400).json({ message: 'lat and lon are required' });
    }
    const key = process.env.LOCATIONIQ_KEY;
    if (!key) {
      return res.status(500).json({ message: 'LOCATIONIQ_KEY is not configured' });
    }
    const url = `https://us1.locationiq.com/v1/reverse?key=${encodeURIComponent(key)}&lat=${encodeURIComponent(lat)}&lon=${encodeURIComponent(lon)}&format=json`;
    const response = await fetch(url);
    if (!response.ok) {
      const text = await response.text();
      return res.status(response.status).json({ message: 'LocationIQ error', details: text });
    }
    const data = await response.json();
    return res.json(data);
  } catch (err) {
    return res.status(500).json({ message: 'Failed to fetch location', error: err.message });
  }
}

async function patchBaseLocation(req, res, next) {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    const { lat, lon } = req.body || {};
    if (!lat || !lon) {
      return res.status(400).json({ message: 'lat and lon are required' });
    }
    const key = process.env.LOCATIONIQ_KEY;
    if (!key) {
      return res.status(500).json({ message: 'LOCATIONIQ_KEY is not configured' });
    }
    const url = `https://us1.locationiq.com/v1/reverse?key=${encodeURIComponent(key)}&lat=${encodeURIComponent(lat)}&lon=${encodeURIComponent(lon)}&format=json`;
    const response = await fetch(url);
    if (!response.ok) {
      const text = await response.text();
      return res.status(response.status).json({ message: 'LocationIQ error', details: text });
    }
    const data = await response.json();

    const user = await User.findOne({ where: { uuid: userId } });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const parts = [];
    if (data?.address?.city) parts.push(data.address.city);
    if (data?.address?.state) parts.push(data.address.state);
    if (data?.address?.country) parts.push(data.address.country);
    const display = data?.display_name || parts.join(', ');

    const newBase = display ? [display] : [];
    await user.update({ base_location: newBase });
    return res.json({ message: 'Base location updated', base_location: user.base_location, raw: data });
  } catch (err) {
    next(err);
  }
}

module.exports = { register, login, refresh, listUsers, verifyEmail, resendVerification, updateProfile, upload, reverseGeocode, patchBaseLocation };
