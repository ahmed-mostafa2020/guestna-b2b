import { useTranslations } from "next-intl";
import {
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
} from "@mui/material";

const TransferMethodSelector = ({ transferMethod, setTransferMethod }) => {
  const t = useTranslations("profile.myWallet.withdrawPage.transferMethod");

  const transferOptions = [
    // { value: "stc", label: t("stcPay.title") },
    { value: "bank", label: t("bankTransfer.title") },
  ];

  return (
    <div className="mb-6 border-gray-200">
      <FormControl className="w-full">
        <label className="mb-2 font-medium">{t("title")}</label>

        <RadioGroup
          aria-labelledby="transfer-method-group-label"
          name="transferMethod"
          value={transferMethod || "bank"}
          onChange={(e) => setTransferMethod(e.target.value)}
          sx={{ flexDirection: "column", gap: "2px" }}
        >
          {transferOptions.map((option) => (
            <FormControlLabel
              key={option.value}
              sx={{
                textTransform: "capitalize",
                margin: "0",
                "& .MuiFormControlLabel-label": {
                  color: "var(--color-text-dark)",
                  fontWeight: "medium",
                  fontSize: "15px",
                  fontFamily: "var(--font-somar-sans), sans-serif",
                },
              }}
              value={option.value}
              control={
                <Radio
                  sx={{
                    color: "var(--color-text-dark)",
                    "&.Mui-checked": {
                      color: "var(--color-title)",
                    },
                  }}
                />
              }
              label={option.label}
            />
          ))}
        </RadioGroup>
      </FormControl>
    </div>
  );
};

export default TransferMethodSelector;
