/**
 * Client-side image compression helper using HTML5 Canvas API.
 * Compresses images to reduce file size while maintaining quality.
 *
 * @param {File} file - Original image File object
 * @param {Object} options - Configuration options
 * @param {number} [options.maxWidthOrHeight=1920] - Max width or height in pixels
 * @param {number} [options.quality=0.8] - JPEG/WebP quality (0 - 1)
 * @param {number} [options.maxSizeMB=1] - Maximum output file size in MB
 * @returns {Promise<File>} Compressed File or original File if compression fails
 */
export async function compressImage(file, options = {}) {
  const {
    maxWidthOrHeight = 1920,
    quality = 0.8,
    maxSizeMB = 1,
  } = options;

  if (typeof window === "undefined" || typeof document === "undefined") {
    return file;
  }

  // Only compress image files
  if (!file.type.startsWith("image/")) {
    return file;
  }

  // Don't compress GIFs (animation would be lost)
  if (file.type === "image/gif") {
    return file;
  }

  const maxSizeBytes = maxSizeMB * 1024 * 1024;

  // If file is already small enough, skip compression
  if (file.size <= maxSizeBytes) {
    return file;
  }

  return new Promise((resolve) => {
    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(url);

      let { width, height } = img;

      // Scale down if larger than max dimension
      if (width > maxWidthOrHeight || height > maxWidthOrHeight) {
        const ratio = Math.min(
          maxWidthOrHeight / width,
          maxWidthOrHeight / height
        );
        width = Math.round(width * ratio);
        height = Math.round(height * ratio);
      }

      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext("2d");
      if (!ctx) {
        resolve(file);
        return;
      }

      // White background for transparent images (avoid black fill on JPEG)
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, width, height);
      ctx.drawImage(img, 0, 0, width, height);

      // Determine output format
      const outputType =
        file.type === "image/png" ? "image/png" : "image/jpeg";

      // Try progressive quality reduction to hit target size
      const tryCompress = (q) => {
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              resolve(file);
              return;
            }

            // If still too large and quality can be reduced, try again
            if (blob.size > maxSizeBytes && q > 0.3) {
              tryCompress(Math.max(0.3, q - 0.1));
              return;
            }

            // Only use compressed version if it's actually smaller
            if (blob.size < file.size) {
              const ext = outputType === "image/png" ? "png" : "jpg";
              const baseName = (file.name || "image").replace(/\.[^/.]+$/, "");
              const compressedFile = new File(
                [blob],
                `${baseName}_compressed.${ext}`,
                { type: outputType, lastModified: Date.now() }
              );
              resolve(compressedFile);
            } else {
              resolve(file);
            }
          },
          outputType,
          q
        );
      };

      tryCompress(quality);
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      resolve(file);
    };

    img.src = url;
  });
}

export default compressImage;
