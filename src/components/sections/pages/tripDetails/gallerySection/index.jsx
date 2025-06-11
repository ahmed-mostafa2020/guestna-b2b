"use client";

import { useLocale, useTranslations } from "next-intl";

import { useSelector } from "react-redux";

import { Fragment, useState } from "react";

import GalleryHeader from "./GalleryHeader";
import ImageWithPlaceholder from "@components/common/imagesPlaceholder/ImageWithPlaceholder";
import Video from "@components/common/trips/Video";
import CustomizedModal from "@components/common/customizedModal";
import ImagesSlider from "@components/common/sliderWithArrowsSection/ImagesSlider";
import { SwiperSlide } from "swiper/react";

import { Container } from "@mui/material";

import { imagesListIcon } from "@assets/svg";

const GallerySection = () => {
  const [open, setOpen] = useState(false);

  const locale = useLocale();
  const t = useTranslations();

  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const data = useSelector((state) => state.tripDetailsData.data);

  const tripData = data?.trip;

  const specialGalleryImages = tripData?.gallary?.filter(
    (image) => image.urlType === "DISTINCTIVE"
  );

  const imagesList = tripData?.gallary.map((image) => (
    <Fragment key={image._id}>
      <SwiperSlide>
        <ImageWithPlaceholder
          src={image.url}
          alt="activity image"
          width={500}
          height={500}
          className="object-cover max-h-[600px]"
        />
      </SwiperSlide>
    </Fragment>
  ));

  return (
    <>
      <section className="gallery-section">
        <Container maxWidth="lg" className="flex flex-col gap-4">
          <GalleryHeader tripData={tripData} />

          <div className="flex-row-reverse flex-wrap gap-3 centered">
            <div className="relative">
              {specialGalleryImages?.[3]?.url && (
                <ImageWithPlaceholder
                  src={specialGalleryImages?.[3]?.url || ""}
                  alt={`${tripData?.name} image`}
                  width={430}
                  height={550}
                  className={`w-[430px] h-[550px] object-cover ${
                    locale === "ar"
                      ? "rounded-tl-2xl rounded-bl-2xl"
                      : "rounded-tr-2xl rounded-br-2xl"
                  }`}
                />
              )}

              <button
                onClick={handleOpen}
                className="absolute z-[2] gap-3 p-3 bg-white centered end-6 bottom-6 border-textDark rounded-lg"
              >
                {imagesListIcon}
                <span className="text-base">
                  {t("links.showAllImages")} {tripData?.gallary?.length}
                </span>
              </button>
            </div>

            <div className="flex gap-4 lg:flex-col">
              {specialGalleryImages?.[2]?.url && (
                <ImageWithPlaceholder
                  src={specialGalleryImages?.[2]?.url}
                  alt={`${tripData?.name} image`}
                  width={305}
                  height={267}
                  className="w-[305px] h-[267px] object-cover"
                />
              )}
              {specialGalleryImages?.[0]?.url && (
                <ImageWithPlaceholder
                  src={specialGalleryImages?.[0]?.url}
                  alt={`${tripData?.name} image`}
                  width={305}
                  height={267}
                  className="w-[305px] h-[267px] object-cover"
                />
              )}
            </div>

            <div>
              {tripData?.video ? (
                <Video
                  src={tripData?.video}
                  width="430"
                  height="550"
                  poster={specialGalleryImages?.[3]?.url}
                  showTitleLink={false}
                  cornerVideo={true}
                />
              ) : (
                specialGalleryImages?.[1]?.url && (
                  <ImageWithPlaceholder
                    src={specialGalleryImages?.[1]?.url}
                    alt={`${tripData?.name} image`}
                    width={430}
                    height={550}
                    className={`w-[430px] h-[550px] object-cover ${
                      locale === "ar"
                        ? "rounded-tr-2xl rounded-br-2xl"
                        : "rounded-tl-2xl rounded-bl-2xl"
                    }`}
                  />
                )
              )}
            </div>
          </div>
        </Container>
      </section>

      <CustomizedModal open={open} handleClose={handleClose}>
        <ImagesSlider>{imagesList}</ImagesSlider>
      </CustomizedModal>
    </>
  );
};

export default GallerySection;
