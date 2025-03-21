// processImage.js

const cloudinary = require('cloudinary').v2;

cloudinary.config({
  secure: true,
});

const processImage = async (imagePath) => {
  try {
    const options = {
      use_filename: true,
      unique_filename: false,
      overwrite: true,
    };

    const result = await cloudinary.uploader.upload(imagePath, options);
    console.log(result.url)
    return result.url;  // Return the URL of the uploaded image
  } catch (error) {
    console.error('Error uploading image:', error);
    throw new Error('Image upload failed');
  }
};

module.exports = {
  processImage,
};
