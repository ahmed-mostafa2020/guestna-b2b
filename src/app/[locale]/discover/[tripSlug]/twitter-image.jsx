import { B2B_END_POINTS } from "@constants/b2bAPIs";
import { renderTripShareImage } from "@utils/seo/tripShareImage";

export const alt = "Guestna";

export default function Image({ params }) {
  return renderTripShareImage(B2B_END_POINTS.TRIPDETAILS, params);
}
