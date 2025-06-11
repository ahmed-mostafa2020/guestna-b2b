"use client";

import { useTranslations } from "next-intl";
import { useSelector } from "react-redux";
import TripsSection from "../../common/trips/TripsSection";
import Blog from "./Blog";

const BlogsSection = () => {
  const blogsData = useSelector((state) => state.homeData.items.blogs);

  const t = useTranslations();

  const data = {
    title: t("blogs.title"),
    subTitle: t("blogs.subTitle"),
    slug: "showAll",
  };

  const blogsList = blogsData?.map((blog) => (
    <Blog key={blog._id} blog={blog} />
  ));

  return (
    <>
      <TripsSection data={data} withSwiper={false}>
        <div className="centered rounded-xl flex-wrap overflow-hidden">
          {blogsList}
        </div>
      </TripsSection>
    </>
  );
};

export default BlogsSection;
