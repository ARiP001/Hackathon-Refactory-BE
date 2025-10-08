const cloudinary = require('../config/cloudinary');

async function uploadBufferToCloudinary(buffer, options = {}) {
  if (!buffer) throw new Error('No buffer provided');
  if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
    throw new Error('Cloudinary is not configured');
  }
  return await new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(options, (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
    stream.end(buffer);
  });
}

module.exports = { uploadBufferToCloudinary };


