import { Box, Card, CardContent, Typography } from "@mui/material";
import React from "react";

const OrderDataCard = ({ title, subtitle, children }) => {
  return (
    <Card className="!bg-transparent !rounded-2xl border-2 border-[#EAEAEA]  p-5">
      <CardContent>
        <Box className="mb-6" >
        <Typography className="!font-somar !text-xl   ">{title}</Typography>
        {subtitle && (
          <Typography className="!font-somar !text-sm mt-2">{subtitle}</Typography>
        )}
        </Box>
        {children}
      </CardContent>
    </Card>
  );
};

export default OrderDataCard;
