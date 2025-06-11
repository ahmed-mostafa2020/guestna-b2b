import { getRequestConfig } from "next-intl/server";

export default getRequestConfig(async () => {
  const locale = "ar";

  return {
    locale,
    messages: (await import(`./src/app/messages/${locale}.json`)).default,
  };
});
