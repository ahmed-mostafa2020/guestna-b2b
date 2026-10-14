import { readFile } from "node:fs/promises";
import { join } from "node:path";

import getBackendUrl from "@utils/api/getBackendUrl";

const REVALIDATE_SECONDS = 3600;

// Gallery images are requested from the CDN as JPEG (see toShareSizedUrl)
export const SHARE_IMAGE_CONTENT_TYPE = "image/jpeg";

// Ask the image CDN for a share-sized JPEG (keeps it under WhatsApp's size limit)
const toShareSizedUrl = (url) => {
  if (url.includes("res.cloudinary.com") && url.includes("/upload/")) {
    return url.replace("/upload/", "/upload/c_fill,w_1200,h_630,f_jpg,q_auto/");
  }
  if (url.includes("ik.imagekit.io")) {
    const imageKitUrl = new URL(url);
    imageKitUrl.searchParams.set("tr", "w-1200,h-630,f-jpg");
    return imageKitUrl.toString();
  }
  return url;
};

async function getTripGalleryImageUrl(endpoint, tripSlug, locale) {
  const response = await fetch(getBackendUrl(`${endpoint}/${tripSlug}`), {
    headers: {
      "Content-Type": "application/json",
      reqKey: process.env.SECURE_REQ_KEY,
      lang: locale || "ar",
    },
    next: { revalidate: REVALIDATE_SECONDS },
  });
  if (!response.ok) return null;

  const data = await response.json();
  const gallery = data?.trip?.gallary || [];
  const image =
    gallery.find((item) => item?.urlType === "DISTINCTIVE" && item?.url) ||
    gallery.find((item) => item?.url);

  return image?.url?.startsWith("https://") ? image.url : null;
}

// Social share image for trip details pages: first gallery image, falling back to the logo icon
export async function renderTripShareImage(endpoint, { tripSlug, locale }) {
  try {
    const imageUrl = await getTripGalleryImageUrl(endpoint, tripSlug, locale);
    if (imageUrl) {
      const image = await fetch(toShareSizedUrl(imageUrl), {
        next: { revalidate: REVALIDATE_SECONDS },
      });
      const contentType = image.headers.get("content-type") || "";
      if (image.ok && contentType.startsWith("image/")) {
        return new Response(await image.arrayBuffer(), {
          headers: {
            "Content-Type": contentType,
            "Cache-Control": `public, max-age=${REVALIDATE_SECONDS}`,
          },
        });
      }
    }
  } catch (error) {
    console.error("Trip share image failed:", error?.message);
  }

  const logo = await readFile(
    join(process.cwd(), "public/icons/icon-512x512.png")
  );
  return new Response(logo, {
    headers: {
      "Content-Type": "image/png",
      "Cache-Control": `public, max-age=${REVALIDATE_SECONDS}`,
    },
  });
}
