import { Typography } from '@mui/material';
import React from 'react'

const OrderDataField = ({data ,children}) => {
  return (
    <Typography className="!font-somar w-full border-2 border-[#EAEAEA] rounded-lg p-3 mt-1">
      {children || data}
    </Typography>
  );
}

export default OrderDataField