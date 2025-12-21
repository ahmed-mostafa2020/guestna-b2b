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
  const isParentChecked = group.child.some((c) => selected.has(c._id));

  return (
    <Accordion>
      <AccordionSummary expandIcon={<ExpandMore />}>
        <Box className="flex items-center justify-between w-full">
          <Typography className="!font-somar !font-semibold">
            {group.title}
          </Typography>

          <CustomSwitch
            checked={isParentChecked}
            onChange={() => onParentToggle(group)}
          />
        </Box>
      </AccordionSummary>

      <AccordionDetails className="flex flex-col gap-2">
        {group.child.map((item) => (
          <PermissionItem
            key={item._id}
            item={item}
            disabled={item.permissionType === "MENU_ITEM"}
            checked={selected.has(item._id)}
            onToggle={() => onChildToggle(item, group)}
          />
        ))}
      </AccordionDetails>
    </Accordion>
  );
}
