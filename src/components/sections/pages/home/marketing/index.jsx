import MarketingCard from "./marketingCard";

import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";

import { Container } from "@mui/material";

const MarketingSection = () => {
  const marketingsList = [
    {
      image:
        "https://ik.imagekit.io/v51ywmzjoGuestna/uploads/image%20299.png?updatedAt=1750161620437",
      hoverImage:
        "https://ik.imagekit.io/v51ywmzjoGuestna/uploads/image%20(1).png?updatedAt=1750161621730",
      name: "جستنا جهة رسمية معتمدة لرحلاتكم المدرسية",
      description:
        "نضمن لكم أعلى معايير السلامة والأمان، بتصاريح رسمية من وزارة السياحة وتأمين شامل على كل الرحلات المدرسية",
      contents: [
        {
          title: "مرخصون من وزارة السياحة السعودية",
          icon: "https://ik.imagekit.io/v51ywmzjoGuestna/uploads/shield_1f6e1-fe0f-removebg-preview.png?updatedAt=1750162600812",
          _id: "68515d8e795d1e0dea00575d",
        },
        {
          title: "بوابة خاصة للإدارة ومراجعة الطلبات",
          icon: "https://ik.imagekit.io/v51ywmzjoGuestna/uploads/100th-day-of-school-cartoon-colored-clipart-free-vector-removebg-preview.png?updatedAt=1750162608746",
          _id: "68515d8e795d1e0dea00575e",
        },
        {
          title: "تأمين كامل على الطلاب والمرافقين",
          icon: "https://ik.imagekit.io/v51ywmzjoGuestna/uploads/th__39_-removebg-preview.png?updatedAt=1750162601355",
          _id: "68515d8e795d1e0dea00575f",
        },
        {
          title: "توثيق كامل للرحلات ومتابعة لحظية",
          icon: "https://ik.imagekit.io/v51ywmzjoGuestna/uploads/th__39_-removebg-preview%20(1).png?updatedAt=1750162600356",
          _id: "68515d8e795d1e0dea005760",
        },
      ],
    },
    {
      image:
        "https://ik.imagekit.io/v51ywmzjoGuestna/uploads/image%20(2).png?updatedAt=1750163629493",
      hoverImage:
        "https://ik.imagekit.io/v51ywmzjoGuestna/uploads/image%20(3).png?updatedAt=1750163630003",
      name: "كل شي للرحلة تلقاه عندنا",
      description:
        "من أول الفكرة إلى لحظة العودة، نوفر لك كل شيء تحتاجه لرحلة مدرسية ناجحة. برامج جاهزة، وخدمات مرتبة، ودعم كامل طول الوقت",
      contents: [
        {
          title: "اكثر من 100 برنامج تعليمي وترفيهي جاهز",
          icon: "https://ik.imagekit.io/v51ywmzjoGuestna/uploads/c080ba7fbbbea81fae9b61eb926e3594-removebg-preview.png?updatedAt=1750163626347",
          _id: "68516134795d1e0dea005764",
        },
        {
          title: "نقل وترتيب كامل للباصات والمشرفين وخطط واضحة",
          icon: "https://ik.imagekit.io/v51ywmzjoGuestna/uploads/th__39_-removebg-preview%20(2).png?updatedAt=1750163624970",
          _id: "68516134795d1e0dea005765",
        },
        {
          title: "وجبات مضمونة بخيارات غذائية متنوعة",
          icon: "https://ik.imagekit.io/v51ywmzjoGuestna/uploads/th__39_-removebg-preview%20(3).png?updatedAt=1750163622527",
          _id: "68516134795d1e0dea005766",
        },
        {
          title: "إدارة كاملة للحجوزات والمتابعة أونلاين",
          icon: "https://ik.imagekit.io/v51ywmzjoGuestna/uploads/th__39_-removebg-preview%20(4).png?updatedAt=1750163620522",
          _id: "68516134795d1e0dea005767",
        },
      ],
    },
    {
      image:
        "https://ik.imagekit.io/v51ywmzjoGuestna/uploads/image%20(4).png?updatedAt=1750164293149",
      hoverImage:
        "https://ik.imagekit.io/v51ywmzjoGuestna/uploads/image%20(5).png?updatedAt=1750164289289",
      name: "أرقام تثبت ثقة المدارس فينا",
      description:
        "مو بس ننظّم رحلات… نبني تجارب ناجحة يشهد فيها مدراء المدارس، ويكررونها كل سنة. الثقة تبدأ بخطوة، وودنا تكون خطوتك الجاية معنا.",
      contents: [
        {
          title: "+8500 طالب طلعوا معنا في رحلات مدرسية",
          icon: "https://ik.imagekit.io/v51ywmzjoGuestna/uploads/th__39_-removebg-preview%20(5).png?updatedAt=1750164289250",
          _id: "685163d3795d1e0dea00576b",
        },
        {
          title: "+320رحلة مدرسية نظّمناها من كل الأنواع",
          icon: "https://ik.imagekit.io/v51ywmzjoGuestna/uploads/th__40_-removebg-preview.png?updatedAt=1750164292365",
          _id: "685163d3795d1e0dea00576c",
        },
        {
          title: "20 مدينة سعودية تمت فيها رحلاتنا",
          icon: "https://ik.imagekit.io/v51ywmzjoGuestna/uploads/th__41_-removebg-preview.png?updatedAt=1750164291660",
          _id: "685163d3795d1e0dea00576d",
        },
        {
          title: "+100 وجهة تعليمية وترفيهية نتعامل معاها مباشرتاً",
          icon: "https://ik.imagekit.io/v51ywmzjoGuestna/uploads/th__42_-removebg-preview.png?updatedAt=1750164286766",
          _id: "685163d3795d1e0dea00576e",
        },
      ],
    },
  ];

  const renderedMarketings = marketingsList.map((market) => (
    <SwiperSlide key={market._id}>
      <MarketingCard market={market} />
    </SwiperSlide>
  ));

  return (
    <section className="flex gap-5">
      <Container maxWidth="lg" sx={{ paddingInlineEnd: 0 }}>
        <div className="relative md:me-[-50vw] lg:me-[-33.33vw] lg:pe-[328px]">
          <Swiper
            spaceBetween={20}
            breakpoints={{
              320: { slidesPerView: 1.5 },
              480: { slidesPerView: 1.75 },
              640: { slidesPerView: 2.5 },
              1024: { slidesPerView: 3.5 },
            }}
            className="mySwiper"
          >
            {renderedMarketings}
          </Swiper>
        </div>
      </Container>
    </section>
  );
};

export default MarketingSection;
