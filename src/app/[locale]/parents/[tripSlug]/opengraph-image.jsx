import { B2B_END_POINTS } from "@constants/b2bAPIs";
import {
  renderTripShareImage,
  SHARE_IMAGE_CONTENT_TYPE,
} from "@utils/seo/tripShareImage";

export const alt = "Guestna";
export const contentType = SHARE_IMAGE_CONTENT_TYPE;

export default function Image({ params }) {
  return renderTripShareImage(B2B_END_POINTS.PARENT_TRIPDETAILS, params);
}
