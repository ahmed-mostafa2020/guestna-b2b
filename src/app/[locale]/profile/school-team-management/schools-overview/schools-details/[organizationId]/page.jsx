"use client";

import { locationIcon } from "@/src/assets/svg";
import { setOrganizationDetails } from "@/src/store/organizationDetails/organizationDetailsSlice";
import { MenuItem, Typography } from "@material-ui/core";
import { ArrowDropDown, ArrowDropUp } from "@mui/icons-material";
import { Box, Select } from "@mui/material";
import { useTranslations } from "next-intl";
import Image from "next/image";
import React from "react";
import { useDispatch } from "react-redux";

const SchoolsDetailsPage = ({ params }) => {
  const details = {
    _id: "6923498247e5ef30a20c1198",
    url: "https://guestna-revamp-dashboard.vercel.app/",
    email: "qez4i@comfythings.com",
    phone: "+201129427799",
    image:
      "https://cultural-enrika-guestna-43d7043d.koyeb.app/uploads/images/718b98a9-30b0-4416-aa2f-a31112f4d8df.webp",
    balance: {
      availableBalance: 0,
      pendingBalance: 0,
      totalBalance: 0,
    },
    tripsStats: {
      total: 3,
      done: 1,
      pending: 2,
      scheduled: 0,
      canceled: 0,
    },
    studentStats: {
      total: 2,
    },
    users: [
      {
        _id: "69234a1647e5ef30a20c18a9",
        name: "عادل مدارس االامل",
        email: "za0qe@comfythings.com",
        role: "مدير مدرسه",
      },
      {
        _id: "69234cab47e5ef30a20c233e",
        name: "منسق انشطة الامل",
        email: "4njja@comfythings.com",
        role: "منسق الأنشطة ",
      },
      {
        _id: "69234ef547e5ef30a20c28a8",
        name: "مدير المالية الامل",
        email: "gs4hs@comfythings.com",
        role: "مدير المالية الامل",
      },
      {
        _id: "6924480558e326a69aee6c52",
        name: "Joan Whitley",
        email: "jeesy@comfythings.com",
        role: "Magni consectetur ut",
      },
    ],
    name: "مدارس الامل",
    about: "مدارس الامل",
    city: "الرياض",
  };

  //   const locale = useLocale();
  const t = useTranslations();

  //   const { data, isLoading, error } = useFetchData(
  //     `${B2B_END_POINTS.PROFILE.ORGANIZATIONS.ORGANIZATION_DETAILS}/${params.organizationId}`,
  //     {},
  //     {
  //       lang: locale,
  //
  //     }
  //     );

  const dispatch = useDispatch();

  dispatch(setOrganizationDetails(details));
  const [open, setOpen] = React.useState(false);

  const handleSchoolSelect = () => {
    console.log("handleSchoolSelect");
  };

  return (
    <>
      <main className="flex flex-col gap-6 min-h-screen">
        {/* title */}
        <Box>
          <Typography
            variant="h3"
            className="!text-titleColor !font-somar !text-xl "
          >
            اختر المدرسة التي تريد عرض تفاصيلها:
          </Typography>
          <Typography variant="caption" className="!text-textDark !font-somar ">
            إدارة جميع المدارس التابعة للشركة ومتابعة أدائها
          </Typography>
        </Box>

        {/* select school */}
        <Box className="flex flex-col gap-4 bg-white rounded-lg p-4 shadow">
          <Typography variant="h3" className=" !font-somar !text-xl ">
            اختر المدرسة التي تريد عرض تفاصيلها:
          </Typography>
          <Select
            open={open}
            onOpen={() => setOpen(true)}
            onClose={() => setOpen(false)}
            className="w-full"
            IconComponent={() => (
              <ArrowDropDown
                className={`${open && "rotate-180"} left-0 me-2`}
              />
            )}
            size="small"
            defaultValue={params.organizationId}
            onChange={handleSchoolSelect}
            MenuProps={{
              PaperProps: {
                className: "p-2",
              },
            }}
          >
            <MenuItem
              className="!font-somar p-2 !bg-white hover:!bg-buttonsHover "
              value={details._id}
            >
              {details.name}
            </MenuItem>
            <MenuItem
              className="!font-somar p-2 !bg-white hover:!bg-buttonsHover "
              value={details._id}
            >
              {details.name}
            </MenuItem>
            <MenuItem
              className="!font-somar p-2 !bg-white hover:!bg-buttonsHover "
              value={details._id}
            >
              {details.name}
            </MenuItem>
          </Select>
          <Box className="bg-buttonsHover  p-4 rounded-lg flex gap-4">
            <Box className="flex items-center justify-center">
              <Image
                src={details.image}
                alt={details.name}
                width={110}
                height={110}
              />
            </Box>
            <Box className="flex justify-between w-full items-start">
              <Box className="flex flex-col gap-1">
                <Typography
                  variant="h3"
                  className=" !font-somar !text-xl !text-titleColor "
                >
                  {details.name} - {details.city}
                </Typography>
                <Typography
                  variant="caption"
                  className=" !font-somar  !text-titleColor flex items-center gap-1 justify-start"
                >
                  <span>{locationIcon}</span> {details.city}
                </Typography>
              </Box>

              <Box className="flex flex-col gap-1 items-center justify-center">
                <Typography
                  varient="caption"
                  className="!font-somar bg-white p-2 rounded-full  !text-sm"
                >
                  الاداء : 85%
                </Typography>
                <Typography
                  varient="caption"
                  className="!font-somar  rounded-full  !text-sm"
                >
                  الطلاب :{details.studentStats.total}
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>
      </main>
    </>
  );
};

export default SchoolsDetailsPage;
