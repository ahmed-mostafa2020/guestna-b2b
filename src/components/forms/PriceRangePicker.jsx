import React, { useEffect, useState } from "react";
import {
  Box,
  TextField,
  Popover,
  Button,
  Typography,
  Alert,
  InputAdornment,
  Stack,
} from "@mui/material";
import { KeyboardArrowDown, AttachMoney } from "@mui/icons-material";
import { newSarSmall } from "@assets/svg";
import { useTranslations } from "next-intl";

const PriceRangePicker = ({
  minValue = "",
  name,
  maxValue = "",
  onApply = () => {},
  minLabel = "Minimum",
  maxLabel = "Maximum",
  placeholder = "Select price range",
  touched = false,
  errors = null,
  onBlur = () => {},
}) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [tempMin, setTempMin] = useState("");
  const [tempMax, setTempMax] = useState("");
  const t = useTranslations();
  const open = Boolean(anchorEl);

  // Sync temp values when popup opens OR when external values change
  useEffect(() => {
    setTempMin(minValue || "");
    setTempMax(maxValue || "");
  }, [minValue, maxValue]);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
    // Trigger blur to mark field as touched
    onBlur();
  };

  const handleApply = () => {
    // Ensure at least one value is set
    const finalMin = tempMin || minValue || "";
    const finalMax = tempMax || maxValue || "";

    onApply(finalMin, finalMax);
    handleClose();
  };

  const handleClear = () => {
    setTempMin("");
    setTempMax("");
    onApply("", "");
  };

  const displayValue = () => {
    if (!minValue && !maxValue) {
      return "";
    }
    return `${minValue || 0} - ${maxValue || 0}`;
  };

  const hasError = tempMin && tempMax && Number(tempMin) > Number(tempMax);

  // Check if there's a validation error from Formik
  const hasValidationError = touched[name] && Boolean(errors[name]);

  return (
    <Box sx={{ width: "100%", position: "relative" }}>
      {/* Main Input Field */}
      <TextField
        fullWidth
        name={name}
        value={displayValue()}
        onClick={handleClick}
        placeholder={placeholder}
        error={hasValidationError}
        errors={errors}
        InputProps={{
          readOnly: true,
          endAdornment: (
            <InputAdornment position="end">
              <span
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginRight: "8px",
                }}
              >
                {newSarSmall}
              </span>
              <KeyboardArrowDown
                sx={{
                  color: "var(--color-text)",
                  transition: "transform 0.3s",
                  transform: open ? "rotate(180deg)" : "rotate(0deg)",
                }}
              />
            </InputAdornment>
          ),
          sx: {
            cursor: "pointer",
            fontFamily: "var(--font-somar), sans-serif",
            "& input": {
              cursor: "pointer",
              fontFamily: "var(--font-somar), sans-serif",
              fontSize: "14px",
            },
          },
        }}
        sx={{
          fontFamily: "var(--font-somar), sans-serif",
          "& .MuiOutlinedInput-root": {
            border: "2px solid var(--color-border)",
            borderRadius: "8px",
            fontFamily: "var(--font-somar), sans-serif",
            "& fieldset": {
              border: "none",
            },
            "&:hover": {
              border: "2px solid var(--color-main)",
            },
            "&.Mui-focused": {
              border: "2px solid var(--color-main)",
            },
            "&.Mui-error": {
              border: "2px solid #ef4444",
            },
          },
          "& .MuiInputBase-input::placeholder": {
            color: "var(--color-text)",
            opacity: 0.6,
            fontFamily: "var(--font-somar), sans-serif",
            fontSize: "14px",
          },
        }}
      />

      {/* Error Message from Formik Validation */}
      {hasValidationError && (
        <Typography
          sx={{
            color: "#ef4444",
            fontSize: "12px",
            fontFamily: "var(--font-somar), sans-serif",
            marginTop: "4px",
            marginLeft: "14px",
          }}
        >
          {typeof errors === "object"
            ? errors[name].min ||
              errors[name].max ||
              t("forms.validation.require", {
                defaultValue: "Price range is required",
              })
            : errors}
        </Typography>
      )}

      {/* Popover */}
      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        PaperProps={{
          sx: {
            mt: 1,
            p: 3,
            fontFamily: "var(--font-somar), sans-serif",
            borderRadius: "8px",
            boxShadow:
              "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
          },
        }}
      >
        {/* Min and Max Inputs */}
        <Stack direction="row" gap={2} mb={3}>
          {/* Minimum Price */}
          <Stack direction="column" gap={1} flex={1}>
            <Typography
              sx={{
                fontFamily: "var(--font-somar), sans-serif",
                fontWeight: 500,
                color: "var(--color-text)",
              }}
            >
              {minLabel}
            </Typography>
            <TextField
              fullWidth
              type="number"
              value={tempMin}
              onChange={(e) => setTempMin(e.target.value)}
              placeholder="0"
              inputProps={{
                step: 50,
              }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <span style={{ display: "flex", alignItems: "center" }}>
                      {newSarSmall}
                    </span>
                  </InputAdornment>
                ),
                sx: {
                  fontFamily: "var(--font-somar), sans-serif",
                  "& input": {
                    fontFamily: "var(--font-somar), sans-serif",
                  },
                },
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  border: "2px solid var(--color-border)",
                  borderRadius: "8px",
                  "& fieldset": {
                    border: "none",
                  },
                  "&:hover": {
                    border: "2px solid var(--color-main)",
                  },
                  "&.Mui-focused": {
                    border: "2px solid var(--color-main)",
                  },
                },
              }}
              onKeyDown={(e) => {
                if (
                  e.key === "e" ||
                  e.key === "E" ||
                  e.key === "+" ||
                  e.key === "-"
                ) {
                  e.preventDefault();
                }
              }}
            />
          </Stack>

          {/* Maximum Price */}
          <Stack direction="column" gap={1} flex={1}>
            <Typography
              sx={{
                fontFamily: "var(--font-somar), sans-serif",
                fontWeight: 500,
                color: "var(--color-text)",
              }}
            >
              {maxLabel}
            </Typography>
            <TextField
              fullWidth
              type="number"
              value={tempMax}
              onChange={(e) => setTempMax(e.target.value)}
              placeholder="1000"
              inputProps={{
                step: 50,
              }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <span style={{ display: "flex", alignItems: "center" }}>
                      {newSarSmall}
                    </span>
                  </InputAdornment>
                ),
                sx: {
                  fontFamily: "var(--font-somar), sans-serif",
                  "& input": {
                    fontFamily: "var(--font-somar), sans-serif",
                  },
                },
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  border: "2px solid var(--color-border)",
                  borderRadius: "8px",
                  "& fieldset": {
                    border: "none",
                  },
                  "&:hover": {
                    border: "2px solid var(--color-main)",
                  },
                  "&.Mui-focused": {
                    border: "2px solid var(--color-main)",
                  },
                },
              }}
              onKeyDown={(e) => {
                if (
                  e.key === "e" ||
                  e.key === "E" ||
                  e.key === "+" ||
                  e.key === "-"
                ) {
                  e.preventDefault();
                }
              }}
            />
          </Stack>
        </Stack>

        {/* Error Message for min > max */}
        {hasError && (
          <Alert
            severity="error"
            sx={{
              mb: 2,
              fontFamily: "var(--font-somar), sans-serif",
              "& .MuiAlert-message": {
                fontFamily: "var(--font-somar), sans-serif",
              },
            }}
          >
            {t(
              "forms.customTrip.steps.pricing.fields.price.error.min_exceed_max",
              { defaultValue: "Minimum price cannot exceed maximum price" }
            )}
          </Alert>
        )}

        {/* Action Buttons */}
        <Stack direction="row" gap={2}>
          <Button
            fullWidth
            variant="outlined"
            onClick={handleClear}
            sx={{
              fontFamily: "var(--font-somar), sans-serif",
              fontWeight: 600,
              borderRadius: "8px",
              borderWidth: "2px",
              borderColor: "var(--color-border)",
              color: "var(--color-text)",
              "&:hover": {
                borderWidth: "2px",
                borderColor: "var(--color-main)",
                backgroundColor: "transparent",
              },
            }}
          >
            {t("links.clear")}
          </Button>
          <Button
            fullWidth
            variant="contained"
            onClick={handleApply}
            disabled={hasError || (!tempMin && !tempMax)}
            sx={{
              fontFamily: "var(--font-somar), sans-serif",
              fontWeight: 600,
              borderRadius: "8px",
              backgroundColor: "var(--color-main)",
              "&:hover": {
                backgroundColor: "var(--color-main)",
                opacity: 0.9,
              },
              "&.Mui-disabled": {
                backgroundColor: "#d1d5db",
                color: "#9ca3af",
              },
            }}
          >
            {t("links.confirm")}
          </Button>
        </Stack>
      </Popover>
    </Box>
  );
};

export default PriceRangePicker;
