import Link from "next/link";

import { useLocale } from "next-intl";

import { memo } from "react";

import ImageWithPlaceholder from "../../common/imagesPlaceholder/ImageWithPlaceholder";

const Category = ({ category }) => {
  const locale = useLocale();

  return (
    <Link
      href={`/${locale}/discover?categories=${category._id}`}
      style={{ perspective: "200px" }}
      className="relative block overflow-hidden group lg:flex-1"
    >
      <div className="transition-transform duration-1000 ease-in-out transform-gpu group-hover:scale-[2]">
        <ImageWithPlaceholder
          src={category.icon}
          alt={category.name}
          width={400}
          height={550}
          className="h-full lg:h-[550px] w-full object-cover transition-transform duration-1000"
        />
      </div>

      <div className="absolute flex flex-col w-full gap-2 px-3 bottom-9 start-0">
        <h5 className="pb-2 text-sm font-medium text-white border-b border-white">
          {category.name}
        </h5>
        <h4 className="text-sm font-semibold text-white lg:text-lg lg:leading-8">
          {category.description}
        </h4>
      </div>
    </Link>
  );
};

export default memo(Category);
