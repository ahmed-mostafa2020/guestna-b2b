import { memo } from "react";

import { Container } from "@mui/material";

const SuccessBooking = ({ data }) => {
  return (
    <Container maxWidth="lg" className="flex-col centered ">
      <div className="">{data.bookingInfo.orderId}</div>
    </Container>
  );
};

export default memo(SuccessBooking);
