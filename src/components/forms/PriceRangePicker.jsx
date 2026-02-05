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
import { useField } from "formik";

const PriceRangePicker = ({
  name,
  minLabel = "Minimum",
  maxLabel = "Maximum",
  placeholder = "Select price range",
}) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [tempMin, setTempMin] = useState("");
  const [tempMax, setTempMax] = useState("");
  const t = useTranslations();
  const open = Boolean(anchorEl);

  // Use Formik's useField hook for complete integration
  const [field, meta, helpers] = useField(name);
  const { value } = field;
  const { touched, error } = meta;
  const { setValue, setTouched } = helpers;

  // Sync temp values when popup opens OR when field value changes
  useEffect(() => {
    if (open) {
      // When opening popover, sync with current field values
      setTempMin(value?.min || "");
      setTempMax(value?.max || "");
    }
  }, [open, value]);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
    // Reset temp values to current field values
    setTempMin(value?.min || "");
    setTempMax(value?.max || "");
    // Don't mark as touched when just closing - only touch when applying
  };

  const handleApply = () => {
    // Only apply if values are valid
    if (exceedError) return;

    // Update Formik field value
    setValue({
      min: tempMin || "",
      max: tempMax || "",
    });

    // Mark as touched to trigger validation
    setTouched(true);
    handleClose();
  };

  const handleClear = () => {
    setTempMin("");
    setTempMax("");
    setValue({ min: "", max: "" });
    setTouched(true);
  };

  const displayValue = () => {
    if (!value || (!value.min && !value.max)) {
      return "";
    }
    return `${value.min || 0} - ${value.max || 0}`;
  };

  // Validate min > max in the popover
  const exceedError = tempMin && tempMax && Number(tempMin) > Number(tempMax);

  return (
    <Box sx={{ width: "100%", position: "relative" }}>
      {/* Main Input Field */}
      <TextField
        fullWidth
        name={name}
        value={displayValue()}
        onClick={handleClick}
        placeholder={placeholder}
        error={false}
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
                min: 0,
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
                min: 0,
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
        {exceedError && (
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
            disabled={exceedError || !tempMin || !tempMax}
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
