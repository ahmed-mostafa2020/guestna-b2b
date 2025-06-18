import FeatureTripCard from "./FeatureTripCard";

import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Pagination } from "swiper/modules";

import { Container } from "@mui/material";

const FeatureTrips = () => {
  const featureTripsList = [
    {
      _id: "684ee26714c2d0add2770beb",
      slug: "king-fahd-public-library-in-jeddah",
      tripsType: "ACTIVITY",
      feature: {
        image: {
          app: "https://ik.imagekit.io/v51ywmzjoGuestna/uploads/image%20(6).png?updatedAt=1750237147726",
          web: "https://ik.imagekit.io/v51ywmzjoGuestna/uploads/image%20(6).png?updatedAt=1750237147726",
        },
      },
      name: "مكتبة الملك فهد العامة بجدة",
    },
    {
      _id: "684fd940b1080a92b23f22ff",
      slug: "farm-trip-in-jeddah",
      tripsType: "ACTIVITY",
      feature: {
        image: {
          app: "https://ik.imagekit.io/v51ywmzjoGuestna/uploads/WhatsApp%20Image%202025-06-18%20at%203.06.22%20PM.jpeg?updatedAt=1750248494216",
          web: "https://ik.imagekit.io/v51ywmzjoGuestna/uploads/WhatsApp%20Image%202025-06-18%20at%203.06.22%20PM.jpeg?updatedAt=1750248494216",
        },
      },
      name: "رحلة المزرعة في مدينة جدة",
    },
    {
      _id: "684fe0085032b491f6dac0e0",
      slug: "cultural-and-nature-day-in-jeddah",
      tripsType: "PACKAGE",
      feature: {
        image: {
          app: "https://ik.imagekit.io/v51ywmzjoGuestna/uploads/image%20(7).png?updatedAt=1750248270330",
          web: "https://ik.imagekit.io/v51ywmzjoGuestna/uploads/image%20(7).png?updatedAt=1750248270330",
        },
      },
      name: "يوم ثقافي وطبيعي في جدة",
    },
  ];

  const renderedFeatureTrips = featureTripsList.map((featureTrip) => (
    <SwiperSlide key={featureTrip._id}>
      <FeatureTripCard featureTrip={featureTrip} />
    </SwiperSlide>
  ));

  return (
    <section>
      <Container maxWidth="lg" sx={{ paddingInlineEnd: 0 }}>
        <div className="relative md:me-[-50vw] lg:me-[-33.33vw] lg:pe-[328px]">
          <Swiper
            spaceBetween={20}
            breakpoints={{
              320: { slidesPerView: 2.5 },
              480: { slidesPerView: 2.2 },
              640: { slidesPerView: 2.5 },
              1024: { slidesPerView: 1.35 },
            }}
            pagination={{
              clickable: true,
              // dynamicBullets: true,
            }}
            modules={[Pagination]}
            style={{
              paddingBottom: "50px", // Space for pagination
            }}
            className="mySwiper"
          >
            {renderedFeatureTrips}
          </Swiper>
        </div>
      </Container>
    </section>
  );
};

export default FeatureTrips;
