import { Backdrop, CircularProgress } from "@mui/material";

const FullScreenLoading = ({ status }) => {
  return (
    <Backdrop
      sx={(theme) => ({ color: "#fff", zIndex: theme.zIndex.drawer + 1 })}
      open={status == "pending" && true}
    >
      <CircularProgress sx={{ color: "#007473" }} />
    </Backdrop>
  );
};

export default FullScreenLoading;
