import MainCategoryCard from "./MainCategoryCard";
import { Container } from "@mui/material";

import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";

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
    <SwiperSlide key={category._id}>
      <MainCategoryCard category={category} />
    </SwiperSlide>
  ));

  return (
    <Container maxWidth="lg" sx={{ paddingInlineEnd: 0 }}>
      <div className="relative md:me-[-50vw] lg:me-[-33.33vw] lg:pe-[328px]">
        <Swiper
          spaceBetween={20}
          breakpoints={{
            320: { slidesPerView: 1.5 },
            480: { slidesPerView: 1.7 },
            640: { slidesPerView: 2.5 },
            1024: { slidesPerView: 4.5 },
          }}
          className="mySwiper"
        >
          {renderedMainCategories}
        </Swiper>
      </div>
    </Container>
  );
};

// return <div className="flex gap-5">{renderedMainCategories}</div>;

export default MainCategoriesSlider;
