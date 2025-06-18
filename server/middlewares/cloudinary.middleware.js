import multer from "multer";
import cloudinary from "../utils/cloudinary.connection.js"

//multer
const storage = multer.memoryStorage();
export const upload = multer({ storage });

export const uploadMultiple = upload.array("images", 10)

//cloudinary
//upload image
export const uploadImages = async (req, res, next) => {
  try {
    const files = req.files;

    if (!files || files.length === 0) {
      return next(); // No images provided
    }

    const uploadedImages = [];
    let pending = files.length;

    files.forEach((file) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: "real",
          resource_type: "image",
        },
        (error, result) => {
          if (error) {
            console.error("Cloudinary Upload Error:", error);
            return res.status(500).json({
              message: "Failed to upload image to Cloudinary",
              error,
            });
          }

          uploadedImages.push({
            secure_url: result.secure_url,
            public_id: result.public_id,
          });

          pending--;

          if (pending === 0) {
            req.uploadedImages = uploadedImages;
            next();
          }
        }
      );

      stream.end(file.buffer);
    });
  } catch (error) {
    console.error("Upload Error:", error);
    res.status(500).json({
      message: "An error occurred during the upload",
      error,
    });
  }
};

//update image
export const updateImages = async (req, res, next) => {
  try {
    const files = req.files;
    const publicIds = JSON.parse(req.body.public_ids || "[]");

    if (!files || files.length === 0) return next();

    // First delete old images
    for (const id of publicIds) {
      await cloudinary.uploader.destroy(id);
    }

    // Then upload new images
    const uploadPromises = files.map((file) => {
      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder: "real",
            resource_type: "image",
          },
          (error, result) => {
            if (error) return reject(error);
            resolve({
              secure_url: result.secure_url,
              public_id: result.public_id,
            });
          }
        );
        stream.end(file.buffer);
      });
    });

    const results = await Promise.all(uploadPromises);
    req.uploadedImages = results; // use in controller
    next();
  } catch (error) {
    console.error("Update Images Error:", error);
    res.status(500).json({ message: "Failed to update images", error });
  }
};

//delete image
export const deleteImages = async (req, res, next) => {
  try {
    // If not provided, skip deletion
    if (!req.body.public_ids) {
      return next();
    }

    let publicIds;

    try {
      publicIds = JSON.parse(req.body.public_ids);
    } catch (parseError) {
      console.warn("Invalid JSON for public_ids:", parseError);
      return next(); // skip if not valid JSON
    }

    // If it's not an array or it's empty, skip
    if (!Array.isArray(publicIds) || publicIds.length === 0) {
      return next();
    }

    console.log("Deleting images with IDs:", publicIds);

    const deletePromises = publicIds.map(id =>
      cloudinary.uploader.destroy(id).catch(err => {
        console.error(`Failed to delete image ${id}:`, err);
        return null;
      })
    );

    const results = await Promise.all(deletePromises);
    console.log("Cloudinary delete results:", results);

    next();
  } catch (error) {
    console.error("Delete Images Middleware Error:", error);
    res.status(500).json({ message: "Failed to delete images", error: error.message });
  }
};