import { Card, CardContent, Typography } from "@mui/material";
import React from "react";

const OrderDataCard = ({ title, children }) => {
  return (
    <Card className="!bg-transparent !rounded-2xl border-2 border-[#EAEAEA]  p-5">
      <CardContent>
        <Typography className="!font-somar ">{title}</Typography>

        {children}
      </CardContent>
    </Card>
  );
};

export default OrderDataCard;
