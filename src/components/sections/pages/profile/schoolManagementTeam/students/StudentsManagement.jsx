"use client";

import { memo, useState } from "react";
import { useTranslations } from "next-intl";

import { Accordion, AccordionSummary, AccordionDetails } from "@mui/material";
import { ExpandMore } from "@mui/icons-material";

import StudentsInfo from "./StudentsInfo";

const StudentsManagement = ({ organizationsChildrenStages = [] }) => {
  const t = useTranslations();

  const organizations = Array.isArray(organizationsChildrenStages)
    ? organizationsChildrenStages
    : [];

  // Filter organizations that have childs with length > 0
  const organizationsWithStudents = organizations.filter(
    (org) => org.childs && org.childs.length > 0
  );

  // Set first organization as expanded by default
  const [expanded, setExpanded] = useState(
    organizationsWithStudents.length > 0
      ? organizationsWithStudents[0]._id
      : null
  );

  const handleAccordionChange = (organizationId) => (event, isExpanded) => {
    setExpanded(isExpanded ? organizationId : null);
  };

  if (!organizationsWithStudents.length) {
    return (
      <section className="rounded-2xl border border-dashed border-border bg-white p-6 text-center shadow-card">
        <h2 className="text-lg font-semibold text-titleColor">
          {t("profile.schoolTeamStudents.sectionTitle")}
        </h2>
        <p className="mt-2 text-sm text-textLight">
          {t("profile.schoolTeamStudents.emptySchools")}
        </p>
      </section>
    );
  }

  return (
    <section className="space-y-4 bg-white rounded-2xl shadow-card p-4">
      <div className="flex flex-col gap-2 text-center md:text-start mb-6">
        <p className="text-lg lg:text-2xl font-medium text-titleColor">
          {t("profile.schoolTeamStudents.sectionTitle")}
        </p>
      </div>

      {organizationsWithStudents.map((org) => (
        <Accordion
          key={org._id}
          expanded={expanded === org._id}
          onChange={handleAccordionChange(org._id)}
          className="!rounded-xl !shadow-sm border-2 border-border"
          sx={{
            "&:before": {
              display: "none",
            },
            "&.Mui-expanded": {
              margin: 0,
            },
          }}
        >
          <AccordionSummary
            expandIcon={<ExpandMore />}
            className="!rounded-xl border border-border"
            sx={{
              "& .MuiAccordionSummary-content": {
                margin: "16px 0",
              },
              //   backgroundColor: expanded === org._id ? "#F3F3F3" : "transparent",
              //   "&:hover": {
              //     backgroundColor:
              //       expanded === org._id ? "#F3F3F3" : "rgba(0, 0, 0, 0.04)",
              //   },
            }}
          >
            <div className="flex flex-col gap-2 pe-4 text-xl">
              <p className="font-medium">
                {org.organization?.name ||
                  t("profile.schools_users.unknown_school")}
              </p>
              <p className="font-light">
                {t("profile.schoolTeamStudents.studentsLabel", {
                  count: org.count || 0,
                })}
              </p>
            </div>
          </AccordionSummary>

          <AccordionDetails className="pt-0">
            <StudentsInfo
              totalStudents={org.count || 0}
              grades={org.childs || []}
              organizationId={org.organization?._id}
            />
          </AccordionDetails>
        </Accordion>
      ))}
    </section>
  );
};

export default memo(StudentsManagement);
