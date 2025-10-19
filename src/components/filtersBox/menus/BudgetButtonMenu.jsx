"use client";

import { useTranslations } from "next-intl";
import { useDispatch, useSelector } from "react-redux";
import { updateBudgetRange } from "@store/searchFilter/searchFilterSlice";

import { useEffect, useMemo, useState } from "react";

import formatCurrency from "@utils/FormatCurrency";
import { CONSTANT_VALUES } from "@constants/constantValues";

import Box from "@mui/material/Box";
import Slider from "@mui/material/Slider";

const BudgetButtonMenu = () => {
  const t = useTranslations();

  const dispatch = useDispatch();
  const budgetMin = useSelector((state) => state.searchFilter.budgetRange.min);
  const budgetMax = useSelector((state) => state.searchFilter.budgetRange.max);
  const budgetRange = useMemo(
    () => [budgetMin, budgetMax],
    [budgetMin, budgetMax]
  );

  const [inputMin, setInputMin] = useState(budgetMin);
  const [inputMax, setInputMax] = useState(budgetMax);

  // Sync local state with Redux state
  useEffect(() => {
    setInputMin(budgetMin);
    setInputMax(budgetMax);
  }, [budgetMin, budgetMax]);

  const handleChangeBudget = (event, newValue) => {
    dispatch(updateBudgetRange(newValue));
  };

  // Handle input blur (when user leaves the input)
  const handleBlur = () => {
    let newMin = inputMin;
    let newMax = inputMax;

    // Validate min value
    if (newMin < CONSTANT_VALUES.MIN_BUDGET) {
      newMin = CONSTANT_VALUES.MIN_BUDGET;
    } else if (newMin > newMax) {
      newMin = newMax;
    }

    // Validate max value
    if (newMax > CONSTANT_VALUES.MAX_BUDGET) {
      newMax = CONSTANT_VALUES.MAX_BUDGET;
    } else if (newMax < newMin) {
      newMax = newMin;
    }

    // Update state only if values changed
    if (newMin !== inputMin || newMax !== inputMax) {
      setInputMin(newMin);
      setInputMax(newMax);
      dispatch(updateBudgetRange([newMin, newMax]));
    } else if (newMin !== budgetMin || newMax !== budgetMax) {
      dispatch(updateBudgetRange([newMin, newMax]));
    }
  };

  // Handle input changes (just update local state, don't validate yet)
  const handleMaxChange = (e) => {
    const value = e.target.value === "" ? "" : Number(e.target.value);
    setInputMax(value);
  };

  const handleMinChange = (e) => {
    const value = e.target.value === "" ? "" : Number(e.target.value);
    setInputMin(value);
  };

  return (
    <div className="flex flex-col w-full gap-8 p-3">
      <div className="flex-wrap gap-1 centered">
        <div className="flex min-w-[115px] flex-col flex-1 gap-1 px-2 py-1 border rounded-lg border-textDark">
          <label className="text-base font-medium font-ibm">
            {t("filtersBox.minimum")}
          </label>
          <input
            type="number"
            value={inputMin}
            onChange={handleMinChange}
            onBlur={handleBlur}
            min={CONSTANT_VALUES.MIN_BUDGET}
            max={CONSTANT_VALUES.MAX_BUDGET}
            className="w-full text-sm outline-none"
          />
        </div>

        <div className="flex min-w-[115px] flex-col flex-1 gap-1 px-2 py-1 border rounded-lg border-textDark">
          <label className="text-base font-medium font-ibm">
            {t("filtersBox.maximum")}
          </label>
          <input
            type="number"
            value={inputMax}
            onChange={handleMaxChange}
            onBlur={handleBlur}
            min={CONSTANT_VALUES.MIN_BUDGET}
            max={CONSTANT_VALUES.MAX_BUDGET}
            className="w-full text-sm outline-none"
          />
        </div>
      </div>

      <Box>
        <Slider
          getAriaLabel={() => "Budget range"}
          value={budgetRange}
          onChange={handleChangeBudget}
          valueLabelDisplay="auto"
          valueLabelFormat={(value) => formatCurrency(value)}
          getAriaValueText={(value) => formatCurrency(value)}
          disableSwap
          color="var(--color-main)"
          min={CONSTANT_VALUES.MIN_BUDGET}
          max={CONSTANT_VALUES.MAX_BUDGET}
          sx={{
            "& .MuiSlider-thumb": {
              backgroundColor: "#fff",
              width: "15px",
              height: "15px",
              border: "1px solid #c4c4c4",
              filter: "drop-shadow(0px 4.909px 4.909px rgba(0, 0, 0, 0.25))",
            },
            "& .MuiSlider-track": {
              border: "1px solid var(--color-main)",
              backgroundColor: "var(--color-main)",
            },
            "& .MuiSlider-valueLabel": {
              width: "60px",
              height: "30px",
              borderRadius: "20px",
              background: "#e5e5e5",
              color: "#1f2626",
              padding: "0",
              fontWeight: 300,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            },
            "& .MuiSlider-valueLabel::before": {
              display: "none",
            },
          }}
        />
      </Box>
    </div>
  );
};

export default BudgetButtonMenu;
