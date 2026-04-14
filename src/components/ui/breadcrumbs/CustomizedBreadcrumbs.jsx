"use client";

import Link from "next/link";
import { useLocale } from "next-intl";

import { memo } from "react";

import { Container } from "@mui/material";

import { chevronLeftIcon } from "@assets/svg";

import Breadcrumbs from "@mui/material/Breadcrumbs";
import Stack from "@mui/material/Stack";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";

const CustomizedBreadcrumbs = ({ breadcrumbsList }) => {
  const locale = useLocale();

  const renderedBreadcrumbsList = breadcrumbsList.map((item) => {
    if (item.type === "link") {
      return (
        <Link
          key={item.id}
          href={`/${locale}/${item.link}`}
          className="text-base font-medium leading-6 tracking-tighter transition-all duration-200 ease-in-out border-b border-transparent font-somar text-titleColor hover:border-b hover:border-titleColor"
        >
          {item.name}
        </Link>
      );
    } else {
      return (
        <p
          key={item.id}
          className="text-base font-medium leading-6 tracking-tighter font-somar text-[#9E9E9E]"
        >
          {item.name}
        </p>
      );
    }
  });

  return (
    <div className="pb-5 lg:pb-10">
      <Container maxWidth="lg">
        <Stack spacing={1}>
          <Breadcrumbs
            separator={
              locale === "ar" ? (
                chevronLeftIcon
              ) : (
                <NavigateNextIcon fontSize="small" />
              )
            }
            aria-label="breadcrumb"
          >
            {renderedBreadcrumbsList}
          </Breadcrumbs>
        </Stack>
      </Container>
    </div>
  );
};

export default memo(CustomizedBreadcrumbs);
