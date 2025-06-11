"use client";

import Image from "next/image";

import { useTranslations } from "next-intl";

import { useState } from "react";

import EmailMethodForm from "./EmailMethodForm";
import PhoneMethodForm from "./PhoneMethodForm";
import AuthenticationBy from "../authenticationBy";

import { Box, Tab } from "@mui/material";

import waving from "@assets/gif/waving.gif";
import { TabContext, TabList, TabPanel } from "@mui/lab";

const LoginForm = ({ redirect = true }) => {
  const [value, setValue] = useState("email");

  const t = useTranslations();

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <>
      <div className="flex flex-col gap-4 lg:gap-8">
        <div className="flex items-center gap-1">
          <h1 className="text-2xl text-mainColor">
            {t("forms.auth.login.title")}
          </h1>

          <Image src={waving} alt="login" width={36} height={36} />
        </div>

        <Box>
          <TabContext value={value}>
            <Box>
              <TabList
                onChange={handleChange}
                aria-label="methods"
                className="w-full centered"
                sx={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "center",
                  gap: "10px",
                  "& .MuiTabs-flexContainer": {
                    justifyContent: "center",
                  },
                  "& .MuiTabs-indicator": {
                    backgroundColor: "#007473",
                  },
                }}
              >
                <Tab
                  // onClick={() => setIsEmailMethod(true)}
                  label={t("forms.auth.login.email")}
                  value="email"
                  // icon={<EmailIcon />}
                  sx={{
                    "&.MuiButtonBase-root": {
                      backgroundColor: "white",
                    },
                    "&.MuiButtonBase-root ,&.Mui-selected": {
                      color: "#1F2626",
                      fontSize: { xs: "14px", sm: "16px" },
                      padding: "16px 24px",
                      fontWeight: 500,
                      fontFamily: "var(--font-somar-sans), sans-serif",
                      transition: "all 0.2s ease-in-out",
                    },
                    "&.Mui-selected": {
                      color: "#007473",
                      fontWeight: 600,
                    },
                  }}
                />
                <Tab
                  // onClick={() => setIsEmailMethod(false)}
                  label={t("forms.auth.login.phone")}
                  value="phone"
                  sx={{
                    "&.MuiButtonBase-root": {
                      backgroundColor: "white",
                    },
                    "&.MuiButtonBase-root ,&.Mui-selected": {
                      color: "#1F2626",
                      fontSize: { xs: "14px", sm: "16px" },
                      padding: "16px 24px",
                      fontWeight: 500,
                      fontFamily: "var(--font-somar-sans), sans-serif",
                      transition: "all 0.2s ease-in-out",
                    },
                    "&.Mui-selected": {
                      color: "#007473",
                      fontWeight: 600,
                    },
                  }}
                />
              </TabList>
            </Box>

            <TabPanel value="email" sx={{ padding: 0 }}>
              <EmailMethodForm redirect={redirect} />
            </TabPanel>

            <TabPanel value="phone" sx={{ padding: 0 }}>
              <PhoneMethodForm redirect={redirect} />
            </TabPanel>
          </TabContext>
        </Box>

        <AuthenticationBy />
      </div>
    </>
  );
};

export default LoginForm;
