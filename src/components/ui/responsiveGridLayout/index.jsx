import { memo } from "react";

import { Container } from "@mui/material";
import Grid from "@mui/material/Grid2";

const ResponsiveGridLayout = ({
  LargeSizeGrid,
  SmallSizeGrid,
  largeSizeProps = {},
  smallSizeProps = {},
  largeGridPercent = 8,
  smallGridPercent = 4,
  reverseInMobile = false,
}) => {
  return (
    <Container maxWidth="lg">
      <Grid
        container
        spacing={{ xs: 3, sm: 4, md: 5 }}
        sx={{
          flexDirection: {
            xs: reverseInMobile ? "column-reverse" : "column",
            lg: "row",
          },
        }}
      >
        <Grid
          size={{ xs: 12, sm: 12, lg: largeGridPercent }}
          className="flex flex-col gap-4"
        >
          <LargeSizeGrid {...largeSizeProps} />
        </Grid>

        <Grid
          size={{ xs: 12, sm: 12, lg: smallGridPercent }}
          className="flex flex-col gap-8"
        >
          <SmallSizeGrid {...smallSizeProps} />
        </Grid>
      </Grid>
    </Container>
  );
};

export default memo(ResponsiveGridLayout);
