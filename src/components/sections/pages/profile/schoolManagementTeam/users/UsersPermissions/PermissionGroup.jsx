import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Box,
  Switch,
  styled,
} from "@mui/material";
import { ExpandMore } from "@mui/icons-material";
import PermissionItem from "./PermissionItem";
import CustomSwitch from "./CustomSwitch";

export default function PermissionGroup({
  group,
  selected,
  onParentToggle,
  onChildToggle,
}) {
  const isParentChecked = group.child.some((c) => selected.has(c._id));

  return (
    <Accordion >
      <AccordionSummary expandIcon={<ExpandMore />}>
        <Box
          className="flex gap-2 items-center justify-between w-full py-2"
         
        >
          <Typography className="!font-somar !text-base !font-semibold !text-[#1E1E1C]">
            {group.title}
          </Typography>

          <CustomSwitch
            checked={isParentChecked}
            onChange={() => onParentToggle(group)}
          />
        </Box>
      </AccordionSummary>

      <AccordionDetails className="py-2">
        {group.child.map((item) => (
          <PermissionItem
            key={item._id}
            item={item}
            checked={selected.has(item._id)}
            onToggle={onChildToggle}
          />
        ))}
      </AccordionDetails>
    </Accordion>
  );
}
