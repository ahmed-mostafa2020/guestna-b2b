import { styled } from "@mui/material/styles";
import Switch from "@mui/material/Switch";

const CustomSwitch = styled((props) => (
  <Switch focusVisibleClassName=".Mui-focusVisible" disableRipple {...props} />
))(({ theme }) => ({
  width: 42,
  height: 26,
  padding: 0,
  "& .MuiSwitch-switchBase": {
    padding: 0,
    margin: 2,
    transitionDuration: "300ms",
    "&.Mui-checked": {
      transform: "translateX(16px)",
      color: "var(--color-badge)", // thumb color when checked
      "& + .MuiSwitch-track": {
        backgroundColor: "var(--color-main)", // track color when checked
        opacity: 1,
        border: 0,
      },
      "&.Mui-disabled + .MuiSwitch-track": {
        opacity: 0.5,
      },
    },
    "&.Mui-focusVisible .MuiSwitch-thumb": {
      border: "4px solid var(--color-main)", // focus ring
    },
    "&.Mui-disabled .MuiSwitch-thumb": {
      color: theme.palette.grey[400],
    },
    "&.Mui-disabled + .MuiSwitch-track": {
      opacity: 0.5,
    },
  },
  "& .MuiSwitch-thumb": {
    boxSizing: "border-box",
    width: 22,
    height: 22,
    backgroundColor: "var(--color-bg-home)", // default thumb color
    transition: theme.transitions.create(["background-color", "transform"], {
      duration: 300,
    }),
  },
  "& .MuiSwitch-track": {
    borderRadius: 26 / 2,
    backgroundColor: "#C7C7CC", // default track color
    opacity: 1,
    transition: theme.transitions.create(["background-color", "opacity"], {
      duration: 300,
    }),
  },
}));

export default CustomSwitch;
