import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Box,
  Typography,
  Skeleton,
} from "@mui/material";
import { ExpandMore } from "@mui/icons-material";

export default function PermissionGroupSkeleton({ rows = 3 }) {
  return (
    <Accordion disabled>
      <AccordionSummary expandIcon={<ExpandMore />}>
        <Box className="flex gap-2 items-center justify-between w-full py-2">
          {/* Skeleton for the group title */}
          <Skeleton variant="text" width="40%" height={24} />

          {/* Skeleton for the switch */}
          <Skeleton variant="circular" width={42} height={26} />
        </Box>
      </AccordionSummary>

      <AccordionDetails className="py-2">
        {/* Skeletons for child permission items */}
        {Array.from({ length: rows }).map((_, index) => (
          <Box
            key={index}
            className="flex justify-between items-center gap-2 py-1"
          >
            <Skeleton variant="text" width="60%" height={20} />
            <Skeleton variant="circular" width={22} height={22} />
          </Box>
        ))}
      </AccordionDetails>
    </Accordion>
  );
}
