import { memo } from "react";

import { Accordion, AccordionDetails, AccordionSummary } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const FAQAccordion = ({
  index = 1,
  title,
  subTitle,
  children,
  subAccordion = false,
  summaryColor = "#4B4D53",
  summaryFontSize = 18,
  fontWeight = 500,
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
          padding: "5px",

          border: subAccordion ? "none" : "1px solid #EAEAEA",
          boxShadow: subAccordion
            ? "none"
            : "0px 4px 4px 0px rgba(114, 114, 114, 0.10)",
        },
        "&.Mui-expanded": {
          borderRadius: "16px",
          margin: 0,
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
          fontWeight: fontWeight,
          fontSize: summaryFontSize,
        }}
      >
        <div className="flex flex-col w-full gap-1">
          <div className="flex items-center justify-between">
            <h3
              className={`font-medium ${
                subAccordion ? "text-xl" : "text-2xl text-textDark"
              }`}
            >
              {title}
            </h3>
            {hasIcon && <span>{icon}</span>}
          </div>
          {subTitle && <h4 className="text-sm">{subTitle}</h4>}
        </div>
      </AccordionSummary>
      <AccordionDetails>
        <div className="custom-scrollbar">{children}</div>
      </AccordionDetails>
    </Accordion>
  );
};

export default memo(FAQAccordion);
