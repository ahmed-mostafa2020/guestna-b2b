"use client";

import { useSelector, useDispatch } from "react-redux";
import { setProfileImage } from "@store/profile/profileInfoSlice";

import { useState, memo, useRef } from "react";

import { END_POINTS } from "@constants/APIs";
import { CONSTANT_VALUES } from "@constants/constantValues";
import ImageWithPlaceholder from "@components/ui/imagesPlaceholder/ImageWithPlaceholder";

import axios from "axios";

import Cookies from "js-cookie";

import profilePlaceholderImage from "@assets/profilePlaceholderImage.jpg";

const ProfileImage = ({ hasUploadButton = false }) => {
  const dispatch = useDispatch();
  const image = useSelector((state) => state.profileData.data?.image);
  const fileInputRef = useRef(null);

  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState(null);

  const token = Cookies.get(CONSTANT_VALUES.AUTH_TOKEN);
  const storedProfileImage = Cookies.get(CONSTANT_VALUES.PROFILE_IMAGE);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Reset error state
    setError(null);

    // Check if file is an image
    if (!file.type.startsWith("image/")) {
      setError("Please select an image file");
      return;
    }

    // Check file size (e.g., 5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      setError("Image size should be less than 5MB");
      return;
    }

    try {
      setIsUploading(true);
      const formData = new FormData();
      formData.append("icon", file);

      // Check if token exists
      if (!token) {
        throw new Error("Authentication token not found");
      }

      const response = await axios.patch(
        `${END_POINTS.MAIN}${END_POINTS.PROFILE.UPLOAD_PHOTO}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data) {
        const newImageUrl = response.data;
        dispatch(setProfileImage(newImageUrl || ""));
        Cookies.set(CONSTANT_VALUES.PROFILE_IMAGE, newImageUrl);
      } else {
        throw new Error("No image URL received from server");
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      setError(
        error.response?.data?.message ||
          error.message ||
          "Failed to upload image"
      );
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const getProfileImage = () => {
    if (
      storedProfileImage &&
      storedProfileImage !== "" &&
      storedProfileImage !== undefined
    )
      return storedProfileImage;
    if (image && image !== "") return image;
    return profilePlaceholderImage;
  };

  return (
    <div className="relative group">
      <figure className="overflow-hidden rounded-full cursor-pointer">
        <ImageWithPlaceholder
          src={getProfileImage()}
          alt="profile"
          width={48}
          height={48}
          className="object-contain w-12 h-12 rounded-full"
        />
      </figure>

      {error && (
        <div className="absolute left-0 p-2 mt-1 text-xs text-white bg-error rounded-md -bottom-10">
          {error}
        </div>
      )}

      {hasUploadButton && (
        <>
          {/* Upload icon overlay */}
          <div
            className="absolute inset-0 flex items-center justify-center w-12 h-12 transition-opacity bg-black bg-opacity-50 rounded-full opacity-0 cursor-pointer group-hover:opacity-100"
            onClick={handleUploadClick}
            aria-label="Upload profile image"
          >
            {isUploading ? (
              <svg
                className="w-6 h-6 text-white animate-spin"
                fill="none"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            ) : (
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                ></path>
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                ></path>
              </svg>
            )}
          </div>

          {/* Hidden file input */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
            accept="image/*"
          />
        </>
      )}
    </div>
  );
};

export default memo(ProfileImage);
