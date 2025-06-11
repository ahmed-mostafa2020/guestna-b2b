"use client";

import Link from "next/link";

import { useLocale, useTranslations } from "next-intl";

import { CONSTANT_VALUES } from "@constants/constantValues";

import { appleIcon, googleIcon } from "@assets/svg";

const AuthenticationBy = () => {
  const locale = useLocale();
  const t = useTranslations();

  const vercelUrl = CONSTANT_VALUES.URLS.VERCEL_URL;

  // Google
  const googleAuthUrl =
    `https://accounts.google.com/o/oauth2/v2/auth?` +
    `client_id=${process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}` +
    `&redirect_uri=${encodeURIComponent(
      process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI
    )}` +
    `&response_type=code` +
    `&scope=openid%20email%20profile` +
    `&access_type=offline`;

  // Apple
  const generateState = () => {
    // Only use this in browser environment
    if (typeof window !== "undefined") {
      const array = new Uint32Array(10);
      window.crypto.getRandomValues(array);
      const state = Array.from(array, (dec) =>
        ("0" + dec.toString(16)).slice(-2)
      ).join("");
      sessionStorage.setItem("apple_oauth_state", state);
      return state;
    }
    return "";
  };

  const handleAppleLogin = () => {
    const state = generateState();
    const params = new URLSearchParams({
      // client_id: process.env.NEXT_PUBLIC_APPLE_CLIENT_ID,
      // redirect_uri: process.env.NEXT_PUBLIC_APPLE_REDIRECT_URI,
      // scope: "name email",
      // response_mode: "form_post",
      client_id: "com.guestna.oauth-service",
      redirect_uri: `${vercelUrl}/${locale}/appleCallback`,
      response_type: "code",
      scope: "openid",
      response_mode: "query",
      state: state,
    });

    window.location.href = `https://appleid.apple.com/auth/authorize?${params}`;
  };

  // Function to handle Apple login
  // const handleAppleLogin = () => {
  //   // Environment variables in Next.js should be accessed without process.env in client components
  //   const clientId = process.env.NEXT_PUBLIC_APPLE_CLIENT_ID;
  //   const redirectUri = process.env.NEXT_PUBLIC_APPLE_REDIRECT_URI;

  //   if (!clientId || !redirectUri) {
  //     console.error("Apple OAuth credentials are missing");
  //     return;
  //   }

  //   const params = new URLSearchParams({
  //     client_id: clientId,
  //     redirect_uri: redirectUri,
  //     response_type: "code",
  //     scope: "openid name email",
  //     response_mode: "form_post",
  //     state: generateState(),
  //   });

  //   window.location.href = `https://appleid.apple.com/auth/authorize?${params}`;
  // };

  const authMethodsList = [
    { name: "apple", icon: appleIcon, href: handleAppleLogin },
    { name: "google", icon: googleIcon, href: googleAuthUrl },
    // {icon:facebookIcon, href: googleAuthUrl },
  ];

  const renderedAuthMethods = authMethodsList.map((method, index) =>
    method.name === "google" ? (
      <Link
        key={index}
        href={method.href}
        className="py-4 h-14 px-6 flex-1 centered border rounded-[4px] border-[#1976D2]"
      >
        {method.icon}
      </Link>
    ) : (
      <button
        key={index}
        onClick={handleAppleLogin}
        className="py-4 h-14 px-6 flex-1 centered border rounded-[4px] border-[#1976D2]"
      >
        {method.icon}
      </button>
    )
  );

  return (
    <div className="relative border-t border-border">
      <p className="absolute top-0 px-4 text-sm text-center -translate-x-1/2 -translate-y-1/2 bg-white end-1/2 text-textLight font-ibm">
        {t("forms.auth.login.loginBy")}
      </p>

      <div className="flex items-center justify-between gap-4 pt-8 pb-9">
        {renderedAuthMethods}
      </div>

      <div className="flex justify-center">
        <p className="text-sm text-textLight font-ibm">
          {t("forms.auth.login.haveAnAccount")}
        </p>

        <Link
          href={`/${locale}/signup`}
          className="text-sm font-semibold text-titleColor"
        >
          {t("forms.auth.login.createAccount")}
        </Link>
      </div>
    </div>
  );
};

export default AuthenticationBy;
