import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Box,
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
  const isParentChecked = (group) => selected.has(group._id);

  const isChildChecked = (child) => selected.has(child._id);

  return (
    <Accordion>
      <AccordionSummary expandIcon={<ExpandMore />}>
        <Box className="flex items-center justify-between w-full">
          <Typography className="!font-somar !font-semibold">
            {group.title}
          </Typography>

          <CustomSwitch
            checked={isParentChecked(group)}
            onChange={() => onParentToggle(group)}
          />
        </Box>
      </AccordionSummary>

      <AccordionDetails className="flex flex-col gap-2">
        {group.child.map((item) => (
          <PermissionItem
            key={item._id}
            item={item}
            disabled={item.defaultChecked}
            checked={isChildChecked(item)}
            onToggle={() => onChildToggle(item, group)}
          />
        ))}
      </AccordionDetails>
    </Accordion>
  );
}
