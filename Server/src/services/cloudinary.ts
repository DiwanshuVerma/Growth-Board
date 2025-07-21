import cloudinary from "../config/cloudinary";

import fs from 'fs'

const uploadToCloudinary = async (filePath: string, folder: string) => {
  try {
    const result = await cloudinary.uploader.upload(filePath, { folder });
    fs.unlinkSync(filePath); // Delete the local file after uploading to Cloudinary
    console.log('image uploaded to cloudinary', result.url)
    return result.secure_url; // Return the uploaded image's URL
  } catch (error: any) {
    throw new Error('Failed to upload to Cloudinary: ' + (error.message || error.error?.message || error));
  }
};

export default uploadToCloudinary;
