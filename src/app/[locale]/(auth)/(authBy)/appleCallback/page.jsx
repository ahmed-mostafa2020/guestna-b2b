"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useLocale } from "next-intl";

import { useEffect, useState, useRef } from "react";

import setToken from "@utils/api/setToken";
import FullScreenLoading from "@feedback/loading/FullScreenLoading";
import { getHeaders } from "@utils/helpers/getHeaders";

import axios from "axios";

export default function CallbackPage() {
  const [status, setStatus] = useState("pending");

  const locale = useLocale();
  const router = useRouter();
  const searchParams = useSearchParams();
  const isProcessingRef = useRef(false);

  const headers = getHeaders(locale);

  useEffect(() => {
    const handleAppleCallback = async () => {
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
          // ${process.env.NEXT_PUBLIC_API_URL}
          `https://cultural-enrika-guestna-43d7043d.koyeb.app/auth/apple`,
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
      } finally {
        //  catch (error) {
        //   console.error("Apple authentication failed:", error);
        //   router.push("/login?error=apple_auth_failed");
        // }
        // Reset processing flag
        isProcessingRef.current = false;
      }
    };

    handleAppleCallback();
  }, [router, locale, searchParams, headers]);

  // useEffect(() => {
  //   const handleAppleCallback = async () => {
  //     if (isProcessingRef.current) return;

  //     try {
  //       isProcessingRef.current = true;
  //       const code = searchParams.get("code");
  //       const state = searchParams.get("state");
  //       const error = searchParams.get("error");

  //       if (error) {
  //         throw new Error(`Apple auth error: ${error}`);
  //       }

  //       if (!code) {
  //         throw new Error("Authorization code missing");
  //       }

  //       // Verify state matches stored value
  //       const storedState = sessionStorage.getItem("apple_oauth_state");
  //       if (state !== storedState) {
  //         throw new Error("Invalid state parameter");
  //       }

  //       const response = await axios.post(
  //         `${process.env.NEXT_PUBLIC_API_URL}/auth/apple`,
  //         { code, state },
  //         { headers }
  //       );

  //       setToken(response.data.token);
  //       setStatus("idle");

  //       router.push(`/${locale}`);
  //     } catch (error) {
  //       console.error("Apple authentication failed:", error);
  //       router.push(
  //         `/${locale}/login?error=${encodeURIComponent(error.message)}`
  //       );
  //     } finally {
  //       isProcessingRef.current = false;
  //       sessionStorage.removeItem("apple_oauth_state");
  //     }
  //   };

  //   handleAppleCallback();
  // }, [router, locale, searchParams, headers]);
  return <FullScreenLoading status={status} />;
}
