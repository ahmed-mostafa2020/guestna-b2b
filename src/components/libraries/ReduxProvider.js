"use client";

import { Provider } from "react-redux";
import { store, persistor } from "../../store";
import { PersistGate } from "redux-persist/integration/react";
import { SnackbarProvider } from "notistack";
import { useLocale } from "next-intl";

const ReduxProvider = ({ children }) => {
  const locale = useLocale();
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <SnackbarProvider
          maxSnack={2}
          autoHideDuration={2000}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: locale === "ar" ? "right" : "left",
          }}
        >
          {children}
        </SnackbarProvider>
      </PersistGate>
    </Provider>
  );
};

export default ReduxProvider;
