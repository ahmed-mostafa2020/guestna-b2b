import { useTranslations } from "next-intl";
import { memo, useState, useRef, useEffect } from "react";
import { cn } from "@utils/helpers/cn";

const FilePreview = ({ file, type, onRemove }) => {
  const [previewUrl, setPreviewUrl] = useState("");

  useEffect(() => {
    if (!file) return;
    if (typeof file === "string") {
      setPreviewUrl(file);
      return;
    }
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    return () => {
      URL.revokeObjectURL(url);
    };
  }, [file]);

  if (!previewUrl) return null;

  const fileName = typeof file === "string" ? file.split("/").pop() : file.name;

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleLoadedMetadata = (e) => {
    const media = e.target;
    if (media.duration === Infinity) {
      media.currentTime = 1e101;
      media.ontimeupdate = () => {
        media.ontimeupdate = null;
        media.currentTime = 0;
      };
    }
  };

  return (
    <div className="relative group border border-gray-200 rounded-xl p-3 bg-gray-50 flex flex-col items-center justify-center gap-2 shadow-sm">
      <button
        type="button"
        onClick={onRemove}
        className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1.5 shadow-md transition-colors z-10"
        title="Remove"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      {type === "image" && (
        <div className="w-full flex flex-col items-center">
          <img
            src={previewUrl}
            alt={fileName}
            className="w-full max-h-36 object-contain rounded-lg"
          />
          {typeof file !== "string" && (
            <span className="text-xs text-gray-500 truncate w-full text-center mt-2 px-1" title={fileName}>
              {fileName}
            </span>
          )}
        </div>
      )}

      {type === "audio" && (
        <div className="w-full flex flex-col items-center gap-2">
          <div className="flex items-center gap-2 bg-blue-50 text-blue-700 px-3 py-1.5 rounded-lg w-full">
            <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
            </svg>
            <span className="text-xs font-medium truncate flex-1 flex justify-between items-center" title={fileName}>
              <span className="truncate mr-2">{fileName}</span>
              {file && typeof file !== "string" && file.duration !== undefined && (
                <span className="text-[10px] bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded font-mono font-bold flex-shrink-0">
                  {formatDuration(file.duration)}
                </span>
              )}
            </span>
          </div>
          <audio src={previewUrl} controls onLoadedMetadata={handleLoadedMetadata} className="w-full h-10 mt-1" />
        </div>
      )}

      {type === "video" && (
        <div className="w-full flex flex-col items-center gap-2">
          <div className="relative w-full rounded-lg overflow-hidden bg-black">
            <video src={previewUrl} controls onLoadedMetadata={handleLoadedMetadata} className="w-full max-h-48 rounded-lg" />
            {file && typeof file !== "string" && file.duration !== undefined && (
              <div className="absolute top-2 start-2 bg-black/60 text-white text-[10px] px-2 py-0.5 rounded font-mono font-bold backdrop-blur-sm shadow z-10">
                {formatDuration(file.duration)}
              </div>
            )}
          </div>
          <span className="text-xs text-gray-500 truncate w-full text-center mt-1 px-1" title={fileName}>
            {fileName}
          </span>
        </div>
      )}
    </div>
  );
};

const DynamicFileUpload = memo(
  ({
    type = "image", // "image" | "audio" | "video"
    name,
    label,
    required = false,
    isMultiple = false,
    acceptedTypes,
    maxSizeMB,
    maxCount,
    minCount,
    value,
    errors,
    touched,
    onBlur,
    setFieldValue,
  }) => {
    const t = useTranslations();
    const fileInputRef = useRef(null);
    const [dragActive, setDragActive] = useState(false);
    const [localError, setLocalError] = useState("");
    const [infoMessage, setInfoMessage] = useState("");

    // Audio/Video recording state
    const [activeTab, setActiveTab] = useState("record"); // "record" | "upload"
    const [recordingStatus, setRecordingStatus] = useState("idle"); // "idle" | "recording"
    const [mediaRecorder, setMediaRecorder] = useState(null);
    const [recordingTime, setRecordingTime] = useState(0);
    const timerIntervalRef = useRef(null);
    const streamRef = useRef(null);
    const chunksRef = useRef([]);

    // Video preview elements
    const videoPreviewRef = useRef(null);
    const previewStreamRef = useRef(null);

    // Set defaults based on file type
    const defaultMaxSizes = { image: 5, audio: 10, video: 20 };
    const maxMB = maxSizeMB || defaultMaxSizes[type] || 5;

    const defaultAccepts = {
      image: "image/*",
      audio: "audio/*",
      video: "video/*",
    };
    const acceptAttr = acceptedTypes || defaultAccepts[type];

    const hasValue = isMultiple 
      ? Array.isArray(value) && value.length > 0 
      : value !== null && value !== undefined && value !== "";

    // Set default active tab to 'upload' if a value already exists on mount (e.g. from backend)
    useEffect(() => {
      if (hasValue && typeof value === "string") {
        setActiveTab("upload");
      }
    }, [hasValue, value]);

    const startCameraPreview = async () => {
      try {
        setLocalError("");
        if (typeof navigator === "undefined" || !navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
          return;
        }
        
        if (previewStreamRef.current) {
          previewStreamRef.current.getTracks().forEach((track) => track.stop());
        }

        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        previewStreamRef.current = stream;
        if (videoPreviewRef.current) {
          videoPreviewRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error("Error starting camera preview:", err);
      }
    };

    const stopCameraPreview = () => {
      if (previewStreamRef.current) {
        previewStreamRef.current.getTracks().forEach((track) => track.stop());
        previewStreamRef.current = null;
      }
      if (videoPreviewRef.current) {
        videoPreviewRef.current.srcObject = null;
      }
    };

    // Live video preview effect
    useEffect(() => {
      if (type === "video" && activeTab === "record" && !hasValue && recordingStatus === "idle") {
        startCameraPreview();
      } else {
        stopCameraPreview();
      }
      return () => {
        stopCameraPreview();
      };
    }, [activeTab, hasValue, recordingStatus, type]);

    // Audio/Video recording cleanup on unmount only
    useEffect(() => {
      return () => {
        if (timerIntervalRef.current) {
          clearInterval(timerIntervalRef.current);
        }
        if (streamRef.current) {
          streamRef.current.getTracks().forEach((track) => track.stop());
        }
        stopCameraPreview();
      };
    }, []);

    const getSupportedMimeType = () => {
      const types = ["audio/webm", "audio/mp4", "audio/ogg", "audio/wav", "audio/aac"];
      for (const t of types) {
        if (typeof MediaRecorder !== "undefined" && MediaRecorder.isTypeSupported && MediaRecorder.isTypeSupported(t)) {
          return t;
        }
      }
      return "";
    };

    const getOverrideFileInfo = (originalMime) => {
      // Force recorded voice files to be mp3 / audio/mpeg by default
      if (type === "audio") {
        return { mime: "audio/mpeg", ext: "mp3" };
      }

      if (!acceptedTypes) {
        const ext = originalMime.includes("webm") ? "webm" : originalMime.includes("mp4") ? "mp4" : originalMime.includes("ogg") ? "ogg" : "wav";
        return { mime: originalMime, ext };
      }

      const typesList = typeof acceptedTypes === "string"
        ? acceptedTypes.split(",").map(t => t.trim().toLowerCase())
        : acceptedTypes.map(t => t.toLowerCase());

      if (type === "video") {
        const hasMp4 = typesList.some(t => t.includes("mp4"));
        if (hasMp4) return { mime: "video/mp4", ext: "mp4" };

        const hasWebm = typesList.some(t => t.includes("webm"));
        if (hasWebm) return { mime: "video/webm", ext: "webm" };

        const hasOgg = typesList.some(t => t.includes("ogg"));
        if (hasOgg) return { mime: "video/ogg", ext: "ogv" };

        // Fallback to first video type in the accepted types
        const firstVideo = typesList.find(t => t.startsWith("video/"));
        if (firstVideo) {
          const ext = firstVideo.split("/")[1] || "webm";
          return { mime: firstVideo, ext };
        }
      }

      const ext = originalMime.includes("webm") ? "webm" : originalMime.includes("mp4") ? "mp4" : originalMime.includes("ogg") ? "ogg" : "wav";
      return { mime: originalMime, ext };
    };

    const startRecording = async () => {
      try {
        setLocalError("");
        setInfoMessage(
          type === "video"
            ? t("eventTrips.upload.cameraPermissionPrompt") || "Camera and Microphone access are required. Please click 'Allow' when prompted by your browser."
            : t("eventTrips.upload.micPermissionPrompt") || "Microphone access is required. Please click 'Allow' when prompted by your browser."
        );

        // Check if mediaDevices is supported (required for HTTPS / secure context check)
        if (typeof navigator === "undefined" || !navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
          setInfoMessage("");
          setLocalError(
            type === "video"
              ? t("eventTrips.upload.cameraNotSupported") || "Video recording is not supported in this browser or requires a secure connection (HTTPS)."
              : t("eventTrips.upload.micNotSupported") || "Audio recording is not supported in this browser or requires a secure connection (HTTPS)."
          );
          return;
        }

        const constraints = type === "video" ? { video: true, audio: true } : { audio: true };
        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        streamRef.current = stream;

        // Clear permission info message once access is granted
        setInfoMessage("");

        if (type === "video" && videoPreviewRef.current) {
          videoPreviewRef.current.srcObject = stream;
        }

        const options = {};
        let mime = "";
        if (type === "video") {
          const videoTypes = ["video/webm;codecs=vp9,opus", "video/webm;codecs=vp8,opus", "video/webm", "video/mp4"];
          for (const t of videoTypes) {
            if (typeof MediaRecorder !== "undefined" && MediaRecorder.isTypeSupported && MediaRecorder.isTypeSupported(t)) {
              mime = t;
              break;
            }
          }
        } else {
          mime = getSupportedMimeType();
        }

        if (mime) {
          options.mimeType = mime;
        }

        const recorder = new MediaRecorder(stream, options);
        setMediaRecorder(recorder);
        chunksRef.current = [];

        recorder.ondataavailable = (e) => {
          if (e.data && e.data.size > 0) {
            chunksRef.current.push(e.data);
          }
        };

        recorder.onstop = () => {
          if (streamRef.current) {
            streamRef.current.getTracks().forEach((track) => track.stop());
            streamRef.current = null;
          }

          const defaultMime = type === "video" ? "video/webm" : "audio/webm";
          const recordedMime = recorder.mimeType || defaultMime;
          
          // Map to accepted file types/extensions required by backend/validator
          const { mime, ext } = getOverrideFileInfo(recordedMime);

          const recordedBlob = new Blob(chunksRef.current, { type: mime });

          // If blob is empty or extremely small (less than 100 bytes), don't save it
          if (recordedBlob.size < 100) {
            return;
          }

          // Validate recorded size
          const maxSizeBytes = maxMB * 1024 * 1024;
          if (recordedBlob.size > maxSizeBytes) {
            setLocalError(
              t("eventTrips.upload.sizeError", { size: maxMB }) ||
                `File exceeds maximum size of ${maxMB}MB`
            );
            return;
          }

          const recordedFile = new File([recordedBlob], `recorded_${type}.${ext}`, {
            type: mime,
          });
          recordedFile.duration = recordingTime;

          if (isMultiple) {
            const currentValues = Array.isArray(value) ? value : [];
            setFieldValue(name, [...currentValues, recordedFile]);
          } else {
            setFieldValue(name, recordedFile);
          }

          if (type === "video") {
            stopCameraPreview();
          }
        };

        recorder.start();
        setRecordingStatus("recording");
        setRecordingTime(0);

        const interval = setInterval(() => {
          setRecordingTime((prev) => prev + 1);
        }, 1000);
        timerIntervalRef.current = interval;
      } catch (err) {
        console.error("Error accessing recording devices:", err);
        setInfoMessage("");
        let errorMsg = type === "video"
          ? t("eventTrips.upload.cameraPermissionError") || "Camera or microphone permission denied. Please allow access in browser settings."
          : t("eventTrips.upload.micPermissionError") || "Microphone permission denied. Please allow access in browser settings.";
        
        if (err.name === "NotFoundError" || err.name === "DevicesNotFoundError") {
          errorMsg = type === "video"
            ? t("eventTrips.upload.cameraNotFoundError") || "No camera device found. Please verify your camera is connected."
            : t("eventTrips.upload.micNotFoundError") || "No microphone device found. Please verify your microphone is connected.";
        } else if (err.name === "NotReadableError" || err.name === "TrackStartError") {
          errorMsg = t("eventTrips.upload.micInUseError") || "Device is currently in use by another application.";
        } else if (err.name === "SecurityError") {
          errorMsg = t("eventTrips.upload.micSecurityError") || "Access is blocked due to an unsecure connection (HTTPS is required).";
        }
        
        setLocalError(errorMsg);
      }
    };

    const stopRecording = () => {
      if (mediaRecorder && mediaRecorder.state !== "inactive") {
        mediaRecorder.stop();
      }
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
        timerIntervalRef.current = null;
      }
      setRecordingStatus("idle");
    };

    const formatTime = (seconds) => {
      const mins = Math.floor(seconds / 60);
      const secs = seconds % 60;
      return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
    };

    const validateFile = (file) => {
      // 1. Check size
      const maxSizeBytes = maxMB * 1024 * 1024;
      if (file.size > maxSizeBytes) {
        return t("eventTrips.upload.sizeError", { size: maxMB }) || `File exceeds maximum size of ${maxMB}MB`;
      }

      // 2. Check type if acceptedTypes is provided
      if (acceptedTypes) {
        const typesList = typeof acceptedTypes === "string" 
          ? acceptedTypes.split(",").map(t => t.trim()) 
          : acceptedTypes;
        
        const fileType = file.type;
        const matches = typesList.some(pattern => {
          if (pattern.endsWith("/*")) {
            const prefix = pattern.replace("/*", "");
            return fileType.startsWith(prefix);
          }
          return fileType === pattern || file.name.toLowerCase().endsWith(pattern.toLowerCase());
        });

        if (!matches) {
          return t("eventTrips.upload.typeError") || "File type not allowed";
        }
      }
      return "";
    };

    const processFiles = (fileList) => {
      setLocalError("");
      const validFiles = [];
      let errMessage = "";

      // Check max count before processing
      if (isMultiple && maxCount) {
        const currentCount = Array.isArray(value) ? value.length : 0;
        if (currentCount + fileList.length > maxCount) {
          setLocalError(
            t("eventTrips.upload.maxCountError", { count: maxCount }) ||
              `Maximum ${maxCount} file(s) allowed`
          );
          return;
        }
      }

      for (let i = 0; i < fileList.length; i++) {
        const file = fileList[i];
        const error = validateFile(file);
        if (error) {
          errMessage = error;
          break;
        }
        validFiles.push(file);
      }

      if (errMessage) {
        setLocalError(errMessage);
        return;
      }

      if (validFiles.length > 0) {
        if (isMultiple) {
          const currentValues = Array.isArray(value) ? value : [];
          setFieldValue(name, [...currentValues, ...validFiles]);
        } else {
          setFieldValue(name, validFiles[0]);
        }
      }
    };

    const handleFileChange = (e) => {
      const files = e.target.files;
      if (files && files.length > 0) {
        processFiles(files);
      }
    };

    const handleDrag = (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (e.type === "dragenter" || e.type === "dragover") {
        setDragActive(true);
      } else if (e.type === "dragleave") {
        setDragActive(false);
      }
    };

    const handleDrop = (e) => {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(false);
      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        processFiles(e.dataTransfer.files);
      }
    };

    const handleRemoveFile = (indexToRemove) => {
      if (isMultiple && Array.isArray(value)) {
        const updated = value.filter((_, idx) => idx !== indexToRemove);
        setFieldValue(name, updated.length > 0 ? updated : []);
      } else {
        setFieldValue(name, null);
      }
      setLocalError("");
    };

    const handleBrowseClick = () => {
      fileInputRef.current?.click();
    };

    // Render helper for file input iconography
    const renderIcon = () => {
      switch (type) {
        case "audio":
          return (
            <svg className="w-10 h-10 text-gray-400 group-hover:text-mainColor transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
            </svg>
          );
        case "video":
          return (
            <svg className="w-10 h-10 text-gray-400 group-hover:text-mainColor transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          );
        default: // image
          return (
            <svg className="w-10 h-10 text-gray-400 group-hover:text-mainColor transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          );
      }
    };

    // Determine whether we should still allow adding more files
    const canAddMore = isMultiple
      ? !maxCount || !Array.isArray(value) || value.length < maxCount
      : !hasValue;

    // Min count validation hint
    const currentCount = Array.isArray(value) ? value.length : hasValue ? 1 : 0;
    const belowMinCount = minCount && currentCount < minCount;

    const isRecordable = type === "audio" || type === "video";

    return (
      <div className="flex flex-col gap-3 relative w-full text-start">
        {label && (
          <label className="font-semibold text-gray-700 font-somar text-sm md:text-base flex items-center gap-1">
            {label}
            {required && <span className="text-error font-ibm">*</span>}
          </label>
        )}

        {/* Browser Permission Prompt Banner */}
        {infoMessage && (
          <div className="flex items-center gap-2.5 bg-blue-50 border border-blue-200 text-blue-800 rounded-xl p-3.5 text-sm font-somar animate-pulse">
            <svg className="w-5 h-5 flex-shrink-0 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="font-medium leading-relaxed">
              {infoMessage}
            </span>
          </div>
        )}

        {/* Custom tabs for recordable types (Audio and Video) */}
        {isRecordable && (
          <div className="flex flex-col gap-2">
            <div className="flex border-b border-gray-200 w-full mb-2">
              <button
                type="button"
                onClick={() => setActiveTab("record")}
                disabled={recordingStatus === "recording" || (hasValue && activeTab !== "record")}
                className={cn(
                  "flex-1 py-3 text-center border-b-2 font-somar font-semibold text-sm md:text-base transition-all duration-200",
                  activeTab === "record"
                    ? "border-mainColor text-mainColor"
                    : "border-transparent text-gray-400 hover:text-gray-600",
                  (recordingStatus === "recording" || (hasValue && activeTab !== "record")) && "opacity-50 cursor-not-allowed"
                )}
              >
                {type === "video" 
                  ? t("eventTrips.upload.recordVideo") || "Record Video" 
                  : t("eventTrips.upload.recordVoice") || "Record Voice"}
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("upload")}
                disabled={recordingStatus === "recording" || (hasValue && activeTab !== "upload")}
                className={cn(
                  "flex-1 py-3 text-center border-b-2 font-somar font-semibold text-sm md:text-base transition-all duration-200",
                  activeTab === "upload"
                    ? "border-mainColor text-mainColor"
                    : "border-transparent text-gray-400 hover:text-gray-600",
                  (recordingStatus === "recording" || (hasValue && activeTab !== "upload")) && "opacity-50 cursor-not-allowed"
                )}
              >
                {t("eventTrips.upload.uploadFile") || "Upload File"}
              </button>
            </div>
            
            {hasValue && (
              <span className="text-xs text-gray-400 font-somar px-1 mb-1">
                {t("eventTrips.upload.switchMethodWarning") || "Please remove the current file to switch upload methods"}
              </span>
            )}
          </div>
        )}

        {/* Tab contents / Drag-Drop Zone or Record Button */}
        {isRecordable ? (
          activeTab === "record" ? (
            (!hasValue || canAddMore) && (
              <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-300 rounded-xl bg-white select-none min-h-[160px] relative w-full gap-4">
                
                {/* Video camera preview element */}
                {type === "video" && (
                  <div className="w-full max-w-md aspect-video bg-black rounded-xl overflow-hidden shadow-inner border border-gray-100 relative">
                    <video
                      ref={videoPreviewRef}
                      autoPlay
                      playsInline
                      muted
                      className="w-full h-full object-cover transform -scale-x-100"
                    />
                    {recordingStatus === "recording" && (
                      <div className="absolute top-3 start-3 flex items-center gap-1.5 bg-red-600/85 text-white text-xs px-2 py-1 rounded-full backdrop-blur-sm shadow-md font-somar">
                        <span className="w-2 h-2 rounded-full bg-white animate-ping" />
                        <span>REC</span>
                      </div>
                    )}
                  </div>
                )}

                {recordingStatus === "recording" ? (
                  <div className="flex flex-col items-center gap-4 w-full">
                    {/* Recording active state */}
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-red-500 animate-ping" />
                      <span className="text-sm font-semibold text-red-500 font-somar">
                        {t("eventTrips.upload.recording") || "Recording..."}
                      </span>
                    </div>
                    
                    {/* Sound wave animation (only for audio) */}
                    {type === "audio" && (
                      <div className="flex items-end justify-center gap-1.5 h-10 py-1">
                        <div className="w-1 bg-mainColor rounded-full h-3 animate-pulse" />
                        <div className="w-1 bg-mainColor rounded-full h-6 animate-pulse" style={{ animationDelay: "0.15s" }} />
                        <div className="w-1 bg-mainColor rounded-full h-8 animate-pulse" style={{ animationDelay: "0.3s" }} />
                        <div className="w-1 bg-mainColor rounded-full h-5 animate-pulse" style={{ animationDelay: "0.45s" }} />
                        <div className="w-1 bg-mainColor rounded-full h-7 animate-pulse" style={{ animationDelay: "0.6s" }} />
                        <div className="w-1 bg-mainColor rounded-full h-4 animate-pulse" style={{ animationDelay: "0.75s" }} />
                      </div>
                    )}

                    <div className="text-2xl font-bold font-ibm text-gray-700">
                      {formatTime(recordingTime)}
                    </div>

                    <button
                      type="button"
                      onClick={stopRecording}
                      className="flex items-center justify-center w-14 h-14 rounded-full bg-red-500 hover:bg-red-600 text-white shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
                      aria-label={t("eventTrips.upload.stopRecording") || "Stop Recording"}
                    >
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                        <rect x="6" y="6" width="12" height="12" rx="2" />
                      </svg>
                    </button>
                    <span className="text-xs text-gray-400 font-somar">
                      {t("eventTrips.upload.clickToStop") || "Press to stop"}
                    </span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center w-full gap-3">
                    {/* Recording idle state */}
                    <button
                      type="button"
                      onClick={startRecording}
                      className="flex items-center justify-center w-16 h-16 rounded-full bg-mainColor/10 text-mainColor border border-mainColor/20 hover:bg-mainColor hover:text-white shadow-sm hover:shadow-md transition-all duration-300 transform hover:scale-105 group"
                      aria-label={
                        type === "video"
                          ? t("eventTrips.upload.startVideoRecording") || "Start Video Recording"
                          : t("eventTrips.upload.startRecording") || "Start Recording"
                      }
                    >
                      {type === "video" ? (
                        <svg className="w-7 h-7 group-hover:scale-110 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                      ) : (
                        <svg className="w-7 h-7 group-hover:scale-110 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                        </svg>
                      )}
                    </button>
                    
                    <p className="text-sm font-semibold text-gray-700 font-somar text-center">
                      {type === "video" 
                        ? t("eventTrips.upload.pressToRecordVideo") || "Press to record video" 
                        : t("eventTrips.upload.pressToRecord") || "Press to record"}
                    </p>
                    <p className="text-xs text-gray-400 font-somar text-center">
                      {t("eventTrips.upload.maxSize", { size: maxMB }) || `Maximum file size: ${maxMB}MB`}
                    </p>
                  </div>
                )}
              </div>
            )
          ) : (
            // Upload Tab Content (Drag & Drop Zone)
            (!hasValue || canAddMore) && (
              <div
                onDragEnter={handleDrag}
                onDragOver={handleDrag}
                onDragLeave={handleDrag}
                onDrop={handleDrop}
                onClick={handleBrowseClick}
                className={cn(
                  "cursor-pointer group flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-xl transition-all duration-200 ease-in-out bg-white select-none min-h-[140px]",
                  dragActive 
                    ? "border-mainColor bg-mainColor/5 shadow-md scale-[0.99]" 
                    : touched && (errors || localError)
                    ? "border-error hover:border-error bg-red-50/10"
                    : "border-gray-300 hover:border-mainColor hover:bg-gray-50/50"
                )}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept={acceptAttr}
                  multiple={isMultiple}
                  onChange={handleFileChange}
                  onBlur={onBlur}
                  className="hidden"
                />
                {renderIcon()}
                <p className="mt-2 text-sm font-medium text-gray-700 font-somar text-center">
                  {t("eventTrips.upload.clickToUpload") || "Drag & drop or click to upload"}
                </p>
                <p className="mt-1 text-xs text-gray-400 font-somar text-center">
                  {t("eventTrips.upload.maxSize", { size: maxMB }) || `Maximum file size: ${maxMB}MB`}
                </p>
                {maxCount && (
                  <p className="mt-0.5 text-xs text-gray-400 font-somar text-center">
                    {t("eventTrips.upload.maxCount", { count: maxCount }) || `Maximum ${maxCount} file(s)`}
                  </p>
                )}
              </div>
            )
          )
        ) : (
          // Default Upload Zone for Non-Audio/Video (Image)
          (!hasValue || canAddMore) && (
            <div
              onDragEnter={handleDrag}
              onDragOver={handleDrag}
              onDragLeave={handleDrag}
              onDrop={handleDrop}
              onClick={handleBrowseClick}
              className={cn(
                "cursor-pointer group flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-xl transition-all duration-200 ease-in-out bg-white select-none min-h-[140px]",
                dragActive 
                  ? "border-mainColor bg-mainColor/5 shadow-md scale-[0.99]" 
                  : touched && (errors || localError)
                  ? "border-error hover:border-error bg-red-50/10"
                  : "border-gray-300 hover:border-mainColor hover:bg-gray-50/50"
              )}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept={acceptAttr}
                multiple={isMultiple}
                onChange={handleFileChange}
                onBlur={onBlur}
                className="hidden"
              />
              {renderIcon()}
              <p className="mt-2 text-sm font-medium text-gray-700 font-somar text-center">
                {t("eventTrips.upload.clickToUpload") || "Drag & drop or click to upload"}
              </p>
              <p className="mt-1 text-xs text-gray-400 font-somar text-center">
                {t("eventTrips.upload.maxSize", { size: maxMB }) || `Maximum file size: ${maxMB}MB`}
              </p>
              {maxCount && (
                <p className="mt-0.5 text-xs text-gray-400 font-somar text-center">
                  {t("eventTrips.upload.maxCount", { count: maxCount }) || `Maximum ${maxCount} file(s)`}
                </p>
              )}
            </div>
          )
        )}

        {/* Display Previews */}
        {hasValue && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mt-1">
            {isMultiple && Array.isArray(value) ? (
              value.map((file, idx) => (
                <FilePreview
                  key={idx}
                  file={file}
                  type={type}
                  onRemove={() => handleRemoveFile(idx)}
                />
              ))
            ) : (
              <FilePreview
                file={value}
                type={type}
                onRemove={() => handleRemoveFile(0)}
              />
            )}
          </div>
        )}

        {/* Min count hint */}
        {belowMinCount && hasValue && (
          <span className="text-xs text-amber-600 font-medium font-somar mt-1">
            {t("eventTrips.upload.minCountHint", { count: minCount }) ||
              `Please upload at least ${minCount} file(s)`}
          </span>
        )}

        {/* Errors */}
        {(touched && errors) || localError ? (
          <span className="text-xs text-error font-medium font-somar mt-1">
            {errors || localError}
          </span>
        ) : null}
      </div>
    );
  }
);

DynamicFileUpload.displayName = "DynamicFileUpload";

export default DynamicFileUpload;
