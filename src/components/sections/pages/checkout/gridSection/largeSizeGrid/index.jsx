"use client";

// import { useSelector } from "react-redux";

// import ContactForm from "@components/forms/checkout/contactForm";
import PaymentForm from "@components/forms/checkout/paymentForm";

const LargeSizeGrid = () => {
  // const isPaymentMethods = useSelector(
  //   (state) => state.finalTripDetailsData?.isPaymentMethodsShown
  // );

  return <PaymentForm />;
  // return isPaymentMethods && isSubmitted ? <PaymentForm /> : <ContactForm />;
};

export default LargeSizeGrid;
