"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useLocale } from "next-intl";

import { useEffect, useState, useRef } from "react";

import setToken from "@utils/api/setToken";
import { getHeaders } from "@utils/helpers/getHeaders";
import FullScreenLoading from "@feedback/loading/FullScreenLoading";

import axios from "axios";

export default function CallbackPage() {
  const [status, setStatus] = useState("pending");
  const locale = useLocale();
  const router = useRouter();
  const searchParams = useSearchParams();
  const isProcessingRef = useRef(false);

  const headers = getHeaders(locale);

  useEffect(() => {
    const handleGoogleCallback = async () => {
      // Prevent multiple executions
      if (isProcessingRef.current) return;

      try {
        // Mark as processing
        isProcessingRef.current = true;

        const code = searchParams.get("code");

        if (!code) {
          throw new Error("Authorization code missing");
        }

        // Send code to NestJS backend
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/auth/google`,
          { code },
          {
            headers,
          }
        );

        // Handle response
        const { token } = response.data;

        // Store token
        setToken(token);

        setStatus("idle");
        // Redirect to appropriate page
        router.push(`/${locale}`);
      } catch (error) {
        router.push("/login?error=google_auth_failed");

      } finally {
        // Reset processing flag
        isProcessingRef.current = false;
      }
    };

    handleGoogleCallback();
  }, [router, locale, searchParams, headers]);

  return <FullScreenLoading status={status} />;
}
