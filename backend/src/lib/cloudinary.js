import { v2 as cloudinary } from "cloudinary";

/**
 * ❗ DO NOT call cloudinary.config() here
 * Env vars are not loaded at import time
 */
export default cloudinary;