"use client";

import dynamic from "next/dynamic";
import { SnackbarProvider } from "notistack";

const GitDashboardContent = dynamic(() => import("./GitDashboardContent"), {
  ssr: false,
});

const GitDashboardPage = () => {
  return (
    <SnackbarProvider
      maxSnack={3}
      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      autoHideDuration={500}
    >
      <GitDashboardContent />
    </SnackbarProvider>
  );
};

export default GitDashboardPage;
