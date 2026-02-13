export const sendGTMEvent = (data) => {
  if (typeof window !== "undefined" && window.dataLayer) {
    window.dataLayer.push(data);
  } else {
    console.warn("GTM dataLayer not found");
  }
};

// onClick={() => {
//   sendGTMEvent({
//     event: "buttonClicked",
//     value: "xyz",
//     page: "home",
//     product_id: "12345",
//     product_name: "Premium Package",
//     price: 99.99,
//     currency: "USD",
//     userInfo: token,
//     });
// }}
