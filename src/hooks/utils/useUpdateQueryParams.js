"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";

export function useUpdateQueryParams() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const updateQueryParams = (params, { isAppend = false } = {}) => {
    const newSearchParams = new URLSearchParams(searchParams.toString());

    // Process each parameter individually
    Object.entries(params).forEach(([key, value]) => {
      // Skip empty values
      if (
        value === "" ||
        value === null ||
        value === undefined ||
        value === 0
      ) {
        newSearchParams.delete(key);
        return;
      }

      // Handle arrays (like languages, categories, cities)
      if (Array.isArray(value)) {
        if (isAppend) {
          value.forEach((item) => newSearchParams.append(key, item));
        } else {
          newSearchParams.delete(key);
          value.forEach((item) => newSearchParams.append(key, item));
        }
        return;
      }

      // Handle regular values (including dates and budget)
      if (isAppend) {
        newSearchParams.append(key, value.toString());
      } else {
        newSearchParams.set(key, value.toString());
      }
    });

    const queryString = newSearchParams.toString();
    const newUrl = queryString ? `${pathname}?${queryString}` : pathname;

    router.push(newUrl);
  };

  return updateQueryParams;
}
