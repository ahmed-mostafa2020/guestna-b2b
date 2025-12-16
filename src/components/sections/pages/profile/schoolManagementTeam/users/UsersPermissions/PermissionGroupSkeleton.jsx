import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Box,
  Skeleton,
} from "@mui/material";
import { ExpandMore } from "@mui/icons-material";

export default function PermissionGroupSkeleton({ childrenCount = 4 }) {
  return (
    <Accordion disableGutters>
      <AccordionSummary expandIcon={<ExpandMore />}>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          width="100%"
        >
          {/* Parent title */}
          <Skeleton variant="text" width="60%" height={28} />

          {/* Parent switch */}
          <Skeleton variant="rectangular" width={40} height={24} />
        </Box>
      </AccordionSummary>

      <AccordionDetails>
        {Array.from({ length: childrenCount }).map((_, index) => (
          <Box
            key={index}
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            py={1}
            pl={2}
          >
            {/* Child title */}
            <Skeleton variant="text" width="55%" height={20} />

            {/* Child switch */}
            <Skeleton variant="rectangular" width={32} height={20} />
          </Box>
        ))}
      </AccordionDetails>
    </Accordion>
  );
}
