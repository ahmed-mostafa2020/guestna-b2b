import Bugsnag from "@lib/bugsnag";

// Utility functions for Bugsnag error reporting
export const reportError = (error, context = {}) => {
  if (typeof window !== "undefined" && Bugsnag) {
    Bugsnag.notify(error, (event) => {
      event.addMetadata("context", context);
    });
  }
};

export const setUser = (user) => {
  if (typeof window !== "undefined" && Bugsnag) {
    Bugsnag.setUser(user.id, user.email, user.name);
  }
};

export const addBreadcrumb = (message, metadata = {}, type = "manual") => {
  if (typeof window !== "undefined" && Bugsnag) {
    Bugsnag.leaveBreadcrumb(message, metadata, type);
  }
};

export const setContext = (context) => {
  if (typeof window !== "undefined" && Bugsnag) {
    Bugsnag.setContext(context);
  }
};

// Wrapper for async functions to catch and report errors
export const withBugsnag = (fn) => {
  return async (...args) => {
    try {
      return await fn(...args);
    } catch (error) {
      reportError(error, { function: fn.name, args });
      throw error;
    }
  };
};
