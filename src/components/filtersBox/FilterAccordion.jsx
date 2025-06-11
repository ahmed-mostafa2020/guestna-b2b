import { memo } from "react";

import { Accordion, AccordionDetails, AccordionSummary } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const FilterAccordion = ({
  index = 1,
  title,
  subTitle,
  children,
  subAccordion = false,
  summaryColor = "#4B4D53",
  summaryFontSize = 18,
  hasIcon = false,
  icon,
}) => {
  return (
    <Accordion
      key={index}
      defaultExpanded={index === 0}
      sx={{
        "&.MuiAccordion-rounded": {
          borderRadius: "8px",
          overflow: "hidden",
          backgroundColor: "transparent",
          border: subAccordion ? "none" : "1px solid #EAEAEA",
          boxShadow: subAccordion
            ? "none"
            : "0px 4px 4px 0px rgba(114, 114, 114, 0.10)",
        },
        "&.Mui-expanded": {
          borderRadius: "12px",
          margin: 0,
          border: "none",
          boxShadow: "none",
        },

        "&::before": {
          display: "none",
        },
      }}
    >
      <AccordionSummary
        expandIcon={hasIcon ? null : <ExpandMoreIcon />}
        aria-controls={`${index}-content`}
        id={`${index}-header`}
        sx={{
          color: summaryColor,
          fontWeight: 500,
          fontSize: summaryFontSize,
          backgroundColor: "white",
          "&.Mui-expanded": {
            border: "2px solid #EAEAEA",
            borderRadius: "12px",
            marginBottom: "12px",
            boxShadow: "0px 4px 4px 0px rgba(114, 114, 114, 0.10)",
          },
        }}
      >
        <div className="flex flex-col w-full gap-1">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">{title}</h3>
            {hasIcon && <span>{icon}</span>}
          </div>
          {subTitle && <h4 className="flex gap-1 text-sm">{subTitle}</h4>}
        </div>
      </AccordionSummary>
      <AccordionDetails
        sx={{
          padding: "16px",
          backgroundColor: "white",
          borderRadius: "12px",
          boxShadow: "0px 4px 4px 0px rgba(0, 0, 0, 0.08)",
        }}
      >
        <div className="custom-scrollbar">{children}</div>
      </AccordionDetails>
    </Accordion>
  );
};

export default memo(FilterAccordion);
