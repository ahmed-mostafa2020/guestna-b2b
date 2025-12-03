
"use client";
import { B2B_END_POINTS } from "@/src/constants/b2bAPIs";
import { useFetchData } from "@/src/hooks/useFetchData";
import { setOrganizationDetails, setOrganizationDetailsError, setOrganizationDetailsLoading } from "@/src/store/organizationDetails/organizationDetailsSlice";
import { Typography } from "@material-ui/core";
import { Box } from "@mui/material";
import { useLocale, useTranslations } from "next-intl";
import React from "react";
import { useDispatch, useSelector } from "react-redux";

const SchoolsDetailsPage = () => {
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
//   const t = useTranslations();

//   const organizationId = useSelector(
//     (state) => state.organizationDetails.organizationId
//   );


//   const { data, isLoading, error } = useFetchData(
//     `${B2B_END_POINTS.PROFILE.ORGANIZATIONS.ORGANIZATION_DETAILS}/${organizationId}`,
//     {},
//     {
//       lang: locale,
//       onSuccess: setOrganizationDetails,
//       onLoading: setOrganizationDetailsLoading,
//       onError: setOrganizationDetailsError,
//     }
//     );

    const dispatch = useDispatch();

    dispatch(setOrganizationDetails(details));

    return (
      <>
        <main className="flex flex-col gap-6 min-h-screen">
          <Box>
            <Typography variant="h3" className="!text-titleColor !font-somar !text-xl ">
              اختر المدرسة التي تريد عرض تفاصيلها:
            </Typography>
            <Typography
              variant="caption"
              className="!text-textDark !font-somar "
            >
              إدارة جميع المدارس التابعة للشركة ومتابعة أدائها
            </Typography>
          </Box>
        </main>
      </>
    );
};

export default SchoolsDetailsPage;
