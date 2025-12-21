import { Box, Typography, Switch } from "@mui/material";
import CustomSwitch from "./CustomSwitch";

export default function PermissionItem({ item, checked, onToggle , disabled}) {
  return (
    <Box
      className="flex items-center justify-between w-full py-2 indent-4"
     
    >
      <Typography className="!font-somar !text-base !font-semibold !text-[#1E1E1C]" variant="body2">
        {item.title}
      </Typography>

      <CustomSwitch
        disabled={disabled}
        size="small"
        checked={checked}
        onChange={() => onToggle(item._id)}
      />
    </Box>
  );
}
