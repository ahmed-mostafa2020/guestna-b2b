"use client";

import { useEffect } from 'react';
import Bugsnag from '@lib/bugsnag';

const BugsnagProvider = ({ children }) => {
  useEffect(() => {
    // Bugsnag is already initialized in the lib file
    // This component just ensures it's loaded on the client side
    if (typeof window !== 'undefined' && Bugsnag) {
      console.log('Bugsnag initialized successfully');
    }
  }, []);

  return children;
};

export default BugsnagProvider;
