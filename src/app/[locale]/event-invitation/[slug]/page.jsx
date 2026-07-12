import axios from "axios";
import { B2B_END_POINTS } from "@constants/b2bAPIs";
import EventInvitationClient from "./EventInvitationClient";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "";

// Fetch helper on server
async function fetchEventDetails(slug, locale) {
  try {
    const url = `${BASE_URL}${B2B_END_POINTS.EVENT_INVITATION}/${slug}`;
    const response = await axios.get(url, {
      headers: {
        "Accept-Language": locale || "ar",
      },
      timeout: 8000,
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching event details on server:", error?.message);
    return null;
  }
}

// Generate Metadata for SEO & Social Share (OG/Twitter)
export async function generateMetadata({ params }) {
  const event = await fetchEventDetails(params.slug, params.locale);

  if (!event) {
    return {
      title: "Guestna Event",
    };
  }

  const title = event.name || "Guestna Event";
  const description = event.description || "Join us for this special guestna event invitation.";
  
  const thumbnail = event.thumbnail?.web ||
    event.thumbnail?.app ||
    (typeof event.image === "string"
      ? event.image
      : event.image?.web || event.image?.app) ||
    "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&q=80";

  return {
    title: `Guestna | ${title}`,
    description,
    openGraph: {
      title,
      description,
      images: [
        {
          url: thumbnail,
          width: 800,
          height: 600,
          alt: title,
        },
      ],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [thumbnail],
    },
  };
}

export default function Page({ params }) {
  return <EventInvitationClient params={params} />;
}
