"use client";

import { useTranslations } from "next-intl";

import { useDispatch } from "react-redux";
import { setSendingOtpOption } from "@store/forms/auth/login/loginFormSlice";

import { CONSTANT_VALUES } from "@constants/constantValues";
import CustomizedOptionsRadioGroup from "./CustomizedOptionsRadioGroup";

import { smsIcon, whatsAppIcon } from "@assets/svg";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import { FormControl, RadioGroup } from "@mui/material";

const MoreOptions = ({ handleClose }) => {
  const t = useTranslations();
  const dispatch = useDispatch();

  const sendingOtpOptions = [
    {
      icon: smsIcon,
      name: "SMS",
      description: t("forms.auth.confirmAccount.willSendOtp"),
      value: CONSTANT_VALUES.SENDING_OTP_OPTIONS.SMS,
    },
    {
      icon: whatsAppIcon,
      name: "WhatsApp",
      description: t("forms.auth.confirmAccount.willSendOtp"),
      value: CONSTANT_VALUES.SENDING_OTP_OPTIONS.WHATSAPP,
    },
    {
      icon: <EmailOutlinedIcon />,
      name: "Gmail",
      description: t("forms.auth.confirmAccount.willSendOtp"),
      value: CONSTANT_VALUES.SENDING_OTP_OPTIONS.EMAIL,
    },
  ];

  const renderedSendingOtpOptions = sendingOtpOptions.map((option, index) => (
    <div key={index} className="flex flex-col gap-5">
      <CustomizedOptionsRadioGroup option={option} />
    </div>
  ));

  return (
    <div className="flex flex-col bg-white rounded-2xl lg:w-[490px] px-4 py-8 mx-auto transition-all duration-200 ease-in-out">
      <p className="font-ibm text-black">
        {t("forms.auth.confirmAccount.selectResendType")}
      </p>

      <div className=" mb-10 mt-5">
        <FormControl className="w-full">
          <RadioGroup
            aria-labelledby="demo-radio-buttons-group-label"
            name="radio-buttons-group"
            onChange={(event) => {
              dispatch(setSendingOtpOption(event.target.value));
            }}
          >
            {renderedSendingOtpOptions}
          </RadioGroup>
        </FormControl>
      </div>

      <button
        type="button"
        onClick={handleClose}
        className="px-10 py-3 text-white transition-all duration-200 ease-in-out border-2 rounded-lg bg-mainColor border-mainColor hover:bg-linksHover hover:border-linksHover"
      >
        {t("links.follow")}
      </button>
    </div>
  );
};

export default MoreOptions;
