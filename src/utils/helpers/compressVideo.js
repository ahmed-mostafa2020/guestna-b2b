/**
 * Client-side video compression helper.
 * Uses HTML5 Canvas and MediaRecorder to downscale and re-encode video at lower bitrate.
 * Falls back gracefully to original file if compression is unsupported, fails, or duration is too long.
 *
 * @param {File} file - Original video File object
 * @param {Object} options - Configuration options
 * @param {number} [options.maxDimension=720] - Max width/height dimension (e.g. 720p)
 * @param {number} [options.targetBitrate=1200000] - Target video bitrate (1.2 Mbps)
 * @param {number} [options.maxDurationSec=180] - Maximum duration in seconds to attempt real-time recording
 * @param {Function} [options.onProgress] - Callback with progress percentage (0 - 100)
 * @returns {Promise<File>} Compressed File or original File
 */
export async function compressVideo(file, options = {}) {
  const {
    maxDimension = 720,
    targetBitrate = 1200000,
    maxDurationSec = 180,
    onProgress,
  } = options;

  // If compression APIs are not available in browser, return original
  if (
    typeof window === "undefined" ||
    typeof document === "undefined" ||
    typeof window.MediaRecorder === "undefined"
  ) {
    return file;
  }

  return new Promise((resolve) => {
    let videoUrl = null;
    let cancelled = false;

    const cleanup = (video, canvas) => {
      cancelled = true;
      if (videoUrl) {
        try {
          URL.revokeObjectURL(videoUrl);
        } catch (_) {}
      }
      if (video) {
        video.pause();
        video.removeAttribute("src");
        video.load();
      }
    };

    try {
      videoUrl = URL.createObjectURL(file);
      const video = document.createElement("video");
      video.muted = true;
      video.playsInline = true;
      video.crossOrigin = "anonymous";
      video.preload = "auto";
      video.src = videoUrl;

      // Timeout safety: if compression hangs for more than 4 minutes, fallback to original
      const safetyTimeout = setTimeout(() => {
        cleanup(video);
        resolve(file);
      }, 240000);

      video.onloadedmetadata = () => {
        const duration = video.duration;

        // Skip compression if duration is invalid or exceeds max limit
        if (!duration || isNaN(duration) || duration > maxDurationSec) {
          clearTimeout(safetyTimeout);
          cleanup(video);
          return resolve(file);
        }

        // Calculate scaled dimensions (keep aspect ratio)
        let width = video.videoWidth || 1280;
        let height = video.videoHeight || 720;
        if (width > height) {
          if (width > maxDimension) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          }
        } else {
          if (height > maxDimension) {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }
        // Ensure even dimensions
        width = width % 2 === 0 ? width : width - 1;
        height = height % 2 === 0 ? height : height - 1;

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d", { alpha: false });

        let stream;
        try {
          stream = canvas.captureStream ? canvas.captureStream(25) : null;
        } catch (_) {
          stream = null;
        }

        if (!stream) {
          clearTimeout(safetyTimeout);
          cleanup(video, canvas);
          return resolve(file);
        }

        // Determine supported MIME type
        const mimeTypes = [
          "video/webm;codecs=vp9",
          "video/webm;codecs=vp8",
          "video/webm",
          "video/mp4",
        ];
        const selectedMime = mimeTypes.find((mime) =>
          MediaRecorder.isTypeSupported(mime)
        ) || "video/webm";

        let recorder;
        try {
          recorder = new MediaRecorder(stream, {
            mimeType: selectedMime,
            videoBitsPerSecond: targetBitrate,
          });
        } catch (_) {
          clearTimeout(safetyTimeout);
          cleanup(video, canvas);
          return resolve(file);
        }

        const chunks = [];
        recorder.ondataavailable = (e) => {
          if (e.data && e.data.size > 0) {
            chunks.push(e.data);
          }
        };

        recorder.onstop = () => {
          clearTimeout(safetyTimeout);
          cleanup(video, canvas);

          try {
            const blob = new Blob(chunks, { type: selectedMime });
            // Only use compressed if it actually reduced the size and is valid
            if (blob.size > 0 && blob.size < file.size) {
              const extension = selectedMime.includes("mp4") ? "mp4" : "webm";
              const baseName = (file.name || "video").replace(/\.[^/.]+$/, "");
              const compressedFile = new File(
                [blob],
                `${baseName}_compressed.${extension}`,
                { type: selectedMime, lastModified: Date.now() }
              );
              if (onProgress) onProgress(100);
              return resolve(compressedFile);
            }
          } catch (_) {}

          resolve(file);
        };

        // Draw loop
        let animationFrameId = null;
        const drawFrame = () => {
          if (cancelled || video.paused || video.ended) return;
          if (ctx) {
            ctx.drawImage(video, 0, 0, width, height);
          }
          if (duration > 0 && onProgress) {
            const pct = Math.min(98, Math.round((video.currentTime / duration) * 100));
            onProgress(pct);
          }
          if (video.requestVideoFrameCallback) {
            video.requestVideoFrameCallback(drawFrame);
          } else {
            animationFrameId = requestAnimationFrame(drawFrame);
          }
        };

        video.onended = () => {
          if (animationFrameId) cancelAnimationFrame(animationFrameId);
          if (recorder && recorder.state !== "inactive") {
            recorder.stop();
          }
        };

        video.onerror = () => {
          clearTimeout(safetyTimeout);
          cleanup(video, canvas);
          resolve(file);
        };

        try {
          recorder.start(1000);
          video.play().then(() => {
            drawFrame();
          }).catch(() => {
            clearTimeout(safetyTimeout);
            cleanup(video, canvas);
            resolve(file);
          });
        } catch (_) {
          clearTimeout(safetyTimeout);
          cleanup(video, canvas);
          resolve(file);
        }
      };

      video.onerror = () => {
        cleanup(video);
        resolve(file);
      };
    } catch (_) {
      cleanup();
      resolve(file);
    }
  });
}

export default compressVideo;
