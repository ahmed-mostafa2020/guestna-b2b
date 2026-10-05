/**
 * TEMPORARY static Trip Template for `profile/activities-market`.
 * Mirrors the backend `tripTimplate` shape returned by the home endpoint.
 * Remove once the activities-market endpoint returns `tripTimplate`,
 * then pass `data?.tripTimplate` to <TripTemplateSection /> instead.
 */
export const STATIC_TRIP_TEMPLATE = {
  _id: "6ab9482a1b15fe4dcb6ed3dc",
  name: "Haviva Pat",
  slug: "aristotle-cortez-mp-18352",
  marketTemplate: {
    text: '<h1 style="margin-bottom: 12px; line-height: 1.4;"><strong>اكتشف أفضل ما في المملكة</strong><br></h1><h2 style="margin-bottom: 16px; line-height: 1.4;"><strong>احجز </strong><span style="color: rgb(237, 138, 34);"><strong>ترامبولين</strong></span><strong> لفعالياتك ومناسباتك</strong><br></h2><p style="margin-bottom: 12px; line-height: 1.8;"><strong>أكثر من ١٤ نشاطًا ترفيهيًا عالي الجودة للحفلات، المدارس، والفعاليات الكبيرة — مع التوصيل والتركيب وخدمة متكاملة. كل ما تحتاجه في مكان واحد.</strong></p>',
    keywords: ["دعم فني"],
    galary: [
      "https://ik.imagekit.io/87h3o0r57q/3bd17f44a5c2e1828b31b723ec60f02bc97aa169_VnP877tSI.png",
      "https://ik.imagekit.io/87h3o0r57q/download__3__Jee-dq47w.jpg",
      "https://ik.imagekit.io/87h3o0r57q/download__2__oRi8NSWhH.jpg",
    ],
    isActive: true,
  },
};
