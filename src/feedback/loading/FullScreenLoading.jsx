import { Backdrop, CircularProgress } from "@mui/material";

const FullScreenLoading = ({ status }) => {
  return (
    <div className="flex items-center justify-center lg:min-h-screen">
      <Backdrop
        sx={(theme) => ({ color: "#fff", zIndex: theme.zIndex.drawer + 1 })}
        open={status == "pending" && true}
      >
        <CircularProgress sx={{ color: "var(--color-main)" }} />
      </Backdrop>
    </div>
  );
};

export default FullScreenLoading;
