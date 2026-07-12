"use client";

import { useLocale, useTranslations } from "next-intl";
import { Fragment, useEffect, useState } from "react";
import ImageWithPlaceholder from "@components/ui/imagesPlaceholder/ImageWithPlaceholder";
import Video from "@components/ui/trips/Video";
import CustomizedModal from "@components/ui/customizedModal";
import ImagesSlider from "@components/ui/sliderWithArrowsSection/ImagesSlider";
import { SwiperSlide } from "swiper/react";
import { Container } from "@mui/material";
import { imagesListIcon } from "@assets/svg";
import IosShareIcon from "@mui/icons-material/IosShare";
import useShare from "@hooks/utils/useShare";

const EventGallerySection = ({ event }) => {
  const [height, setHeight] = useState(250);
  const [open, setOpen] = useState(false);

  const locale = useLocale();
  const t = useTranslations();
  const { handleShare } = useShare();

  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const specialGalleryImages = event?.gallary?.filter(
    (image) => image.urlType === "DISTINCTIVE"
  ) || [];

  const imagesList = event?.gallary?.map((image) => (
    <Fragment key={image._id}>
      <SwiperSlide>
        <ImageWithPlaceholder
          src={image.url}
          alt="event image"
          width={500}
          height={500}
          className="object-cover max-h-[250px] lg:max-h-[600px]"
        />
      </SwiperSlide>
    </Fragment>
  )) || [];

  useEffect(() => {
    const handleResize = () => {
      setHeight(window.innerWidth >= 1024 ? 550 : 250);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (!event?.gallary || event.gallary.length === 0) {
    return (
      <Container maxWidth="lg" className="flex flex-col gap-4 lg:gap-6 pb-4">
        <h1 className="text-xl font-semibold text-titleColor lg:text-5xl">
          {event?.name}
        </h1>
        <div className="flex flex-wrap items-center justify-end">
          <div className="flex items-center gap-3">
            <button onClick={handleShare} className="flex items-center gap-1">
              <IosShareIcon fontSize="small" />
              {t("links.share")}
            </button>
          </div>
        </div>
      </Container>
    );
  }

  return (
    <>
      <section className="gallery-section">
        <Container maxWidth="lg" className="flex flex-col gap-4 lg:gap-6">
          <h1 className="text-xl font-semibold text-titleColor lg:text-5xl">
            {event?.name}
          </h1>

          <div className="flex flex-wrap items-center justify-end">
            <div className="flex items-center gap-3">
              <button onClick={handleShare} className="flex items-center gap-1">
                <IosShareIcon fontSize="small" />
                {t("links.share")}
              </button>
            </div>
          </div>

          <div className="flex-row-reverse flex-wrap gap-3 centered w-full">
            {/* If 1 image */}
            {specialGalleryImages.length === 1 && (
              <div className="relative w-full">
                <ImageWithPlaceholder
                  src={specialGalleryImages[0]?.url}
                  alt={`${event?.name} image`}
                  width={1200}
                  height={550}
                  className="w-full h-[250px] lg:h-[550px] object-cover rounded-2xl"
                />
                <button
                  onClick={handleOpen}
                  className="absolute z-[2] gap-3 p-3 bg-white centered end-6 bottom-6 border-textDark rounded-lg"
                >
                  {imagesListIcon}
                  <span className="text-base">
                    {t("links.showAllImages")} {event?.gallary?.length}
                  </span>
                </button>
              </div>
            )}

            {/* If 2 images */}
            {specialGalleryImages.length === 2 && (
              <div className="relative flex flex-col md:flex-row gap-3 w-full">
                <ImageWithPlaceholder
                  src={specialGalleryImages[0]?.url}
                  alt={`${event?.name} image`}
                  width={600}
                  height={550}
                  className="flex-1 w-full md:w-1/2 h-[250px] lg:h-[550px] object-cover rounded-2xl"
                />
                <ImageWithPlaceholder
                  src={specialGalleryImages[1]?.url}
                  alt={`${event?.name} image`}
                  width={600}
                  height={550}
                  className="flex-1 w-full md:w-1/2 h-[250px] lg:h-[550px] object-cover rounded-2xl"
                />
                <button
                  onClick={handleOpen}
                  className="absolute z-[2] gap-3 p-3 bg-white centered end-6 bottom-6 border-textDark rounded-lg"
                >
                  {imagesListIcon}
                  <span className="text-base">
                    {t("links.showAllImages")} {event?.gallary?.length}
                  </span>
                </button>
              </div>
            )}

            {/* If 3 images */}
            {specialGalleryImages.length === 3 && (
              <div className="relative flex flex-col md:flex-row gap-3 w-full">
                {/* Large image */}
                <div className="flex-1 md:w-[60%] w-full">
                  <ImageWithPlaceholder
                    src={specialGalleryImages[0]?.url}
                    alt={`${event?.name} image`}
                    width={750}
                    height={550}
                    className="w-full h-[250px] lg:h-[550px] object-cover rounded-2xl"
                  />
                </div>
                {/* Two stacked images */}
                <div className="flex-1 md:w-[40%] w-full flex md:flex-col gap-3">
                  <ImageWithPlaceholder
                    src={specialGalleryImages[1]?.url}
                    alt={`${event?.name} image`}
                    width={450}
                    height={267}
                    className="flex-1 w-full h-[120px] md:h-[268px] object-cover rounded-2xl"
                  />
                  <ImageWithPlaceholder
                    src={specialGalleryImages[2]?.url}
                    alt={`${event?.name} image`}
                    width={450}
                    height={267}
                    className="flex-1 w-full h-[120px] md:h-[268px] object-cover rounded-2xl"
                  />
                </div>
                <button
                  onClick={handleOpen}
                  className="absolute z-[2] gap-3 p-3 bg-white centered end-6 bottom-6 border-textDark rounded-lg"
                >
                  {imagesListIcon}
                  <span className="text-base">
                    {t("links.showAllImages")} {event?.gallary?.length}
                  </span>
                </button>
              </div>
            )}

            {/* If 4 or more images */}
            {specialGalleryImages.length >= 4 && (
              <>
                <div className="relative">
                  {specialGalleryImages?.[3]?.url && (
                    <ImageWithPlaceholder
                      src={specialGalleryImages?.[3]?.url || ""}
                      alt={`${event?.name} image`}
                      width={430}
                      height={550}
                      className={`w-[430px] h-[250px] lg:h-[550px] object-cover ${
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
                      {t("links.showAllImages")} {event?.gallary?.length}
                    </span>
                  </button>
                </div>

                <div className="flex gap-4 lg:flex-col">
                  {specialGalleryImages?.[2]?.url && (
                    <ImageWithPlaceholder
                      src={specialGalleryImages?.[2]?.url}
                      alt={`${event?.name} image`}
                      width={305}
                      height={267}
                      className="w-[305px] h-[267px] object-cover"
                    />
                  )}
                  {specialGalleryImages?.[0]?.url && (
                    <ImageWithPlaceholder
                      src={specialGalleryImages?.[0]?.url}
                      alt={`${event?.name} image`}
                      width={305}
                      height={267}
                      className="w-[305px] h-[267px] object-cover"
                    />
                  )}
                </div>

                <div>
                  {event?.video ? (
                    <Video
                      src={event?.video}
                      width="430"
                      height={height}
                      poster={specialGalleryImages?.[3]?.url}
                      showTitleLink={false}
                      cornerVideo={true}
                    />
                  ) : (
                    specialGalleryImages?.[1]?.url && (
                      <ImageWithPlaceholder
                        src={specialGalleryImages?.[1]?.url}
                        alt={`${event?.name} image`}
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
              </>
            )}
          </div>
        </Container>
      </section>

      <CustomizedModal open={open} handleClose={handleClose}>
        <ImagesSlider>{imagesList}</ImagesSlider>
      </CustomizedModal>
    </>
  );
};

export default EventGallerySection;
