import { useLocale } from "next-intl";

import { memo } from "react";

import formatDate from "@utils/FormateDate";
import ImageWithPlaceholder from "@components/common/imagesPlaceholder/ImageWithPlaceholder";
const ReviewsCard = ({ imageSrc, name, date, comment }) => {
  const locale = useLocale();

  const maxCharacters = 130;

  const renderedComment =
    comment?.length <= maxCharacters
      ? comment
      : comment?.slice(0, maxCharacters) + "...";

  return (
    <div className="flex flex-col gap-3 px-4 py-6 bg-white border rounded-xl border-accordionBorder">
      <div className="flex items-center gap-2">
        {imageSrc && (
          <figure className="w-12 h-12 overflow-hidden rounded-full">
            <ImageWithPlaceholder
              src={imageSrc}
              alt="profile image"
              width={48}
              height={48}
              className="rounded-full"
            />
          </figure>
        )}

        <div className="flex flex-col gap-1">
          <h3 className="text-lg font-medium">{name}</h3>
          <h4 className="text-sm font-light">{formatDate(date, locale)}</h4>
        </div>
      </div>

      <article title={comment}>{renderedComment}</article>
    </div>
  );
};

export default memo(ReviewsCard);
