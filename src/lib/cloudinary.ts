import cloudinary from 'cloudinary';

function configureCloudinary() {
  cloudinary.v2.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
  });
  return cloudinary.v2;
}

export function generateSignature(paramsToSign: any) {
  const apiSecret = process.env.CLOUDINARY_API_SECRET!;
  return configureCloudinary().utils.api_sign_request(paramsToSign, apiSecret);
}

// Lazy proxy — config() is only called when a method is actually invoked
const cloudinaryProxy = new Proxy({} as typeof cloudinary.v2, {
  get(_target, prop) {
    return configureCloudinary()[prop as keyof typeof cloudinary.v2];
  },
});

export default cloudinaryProxy;
