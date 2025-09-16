"use client";

import React from 'react';
import Bugsnag from '@lib/bugsnag';

const BugsnagErrorBoundary = ({ children }) => {
  if (typeof window !== 'undefined' && Bugsnag) {
    const ErrorBoundary = Bugsnag.getPlugin('react')?.createErrorBoundary(React);
    
    if (ErrorBoundary) {
      return (
        <ErrorBoundary
          FallbackComponent={({ error, info, clearError }) => (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
              <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-6">
                <div className="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 rounded-full mb-4">
                  <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
                <h2 className="text-xl font-semibold text-gray-900 text-center mb-2">
                  Something went wrong
                </h2>
                <p className="text-gray-600 text-center mb-6">
                  We've been notified about this error and will fix it soon.
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={clearError}
                    className="flex-1 bg-mainColor text-white py-2 px-4 rounded-lg hover:bg-opacity-90 transition-colors"
                  >
                    Try Again
                  </button>
                  <button
                    onClick={() => window.location.reload()}
                    className="flex-1 bg-gray-200 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors"
                  >
                    Reload Page
                  </button>
                </div>
              </div>
            </div>
          )}
        >
          {children}
        </ErrorBoundary>
      );
    }
  }
  
  return children;
};

export default BugsnagErrorBoundary;
