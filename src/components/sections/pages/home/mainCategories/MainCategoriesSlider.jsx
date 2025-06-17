import { Fragment } from "react";

import MainCategoryCard from "./MainCategoryCard";

const MainCategoriesSlider = () => {
  const mainCategoriesList = [
    {
      _id: "684eda97bb9f5c64271c8937",
      icon: "https://ik.imagekit.io/v51ywmzjoGuestna/uploads/th%20(32).jpg?updatedAt=1749998319742",
      name: "سياحي",
      description: "السفر من أجل الترفيه والاستكشاف",
    },
    {
      _id: "684eda97bb9f5c64271c8937",
      icon: "https://ik.imagekit.io/v51ywmzjoGuestna/uploads/th%20(32).jpg?updatedAt=1749998319742",
      name: "سياحي",
      description: "السفر من أجل الترفيه والاستكشاف",
    },
    {
      _id: "684eda97bb9f5c64271c8937",
      icon: "https://ik.imagekit.io/v51ywmzjoGuestna/uploads/th%20(32).jpg?updatedAt=1749998319742",
      name: "سياحي",
      description: "السفر من أجل الترفيه والاستكشاف",
    },
  ];

  const renderedMainCategories = mainCategoriesList.map((category) => (
    <Fragment key={category._id}>
      <MainCategoryCard category={category} />
    </Fragment>
  ));

  return <div className="flex gap-5">{renderedMainCategories}</div>;
};

export default MainCategoriesSlider;
