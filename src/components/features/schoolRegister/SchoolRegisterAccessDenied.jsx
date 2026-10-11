import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { BlockOutlined } from "@mui/icons-material";

/**
 * Shown on the school booking page to providers and to auth users without the booking permission.
 * @param {{ isProvider?: boolean }} props
 */
const SchoolRegisterAccessDenied = ({ isProvider = false }) => {
  const locale = useLocale();
  const t = useTranslations();

  return (
    <section
      className="mx-auto flex max-w-md flex-col items-center gap-4 rounded-2xl bg-white px-6 py-10 text-center shadow-sm"
    >
      <span
        className="centered h-16 w-16 rounded-full bg-mainColor/10 text-mainColor"
        aria-hidden="true"
      >
        <BlockOutlined fontSize="large" />
      </span>

      <h2 className="text-xl font-bold text-textDark">
        {t("schoolTripBooking.notForProvider.title")}
      </h2>

      <p className="font-ibm text-sm leading-relaxed text-textDark/70">
        {t(
          isProvider
            ? "schoolTripBooking.notForProvider.description"
            : "schoolTripBooking.notForProvider.noPermissionDescription"
        )}
      </p>

      <div className="mt-2 flex w-full flex-col gap-3 sm:flex-row">
        <Link
          href={`/${locale}/${isProvider ? "provider-profile" : "profile"}`}
          className="flex-1 rounded-lg bg-mainColor px-6 py-3 text-sm font-semibold text-white transition-all duration-200 ease-in-out hover:bg-mainColor/80"
        >
          {t("schoolTripBooking.notForProvider.goToProfile")}
        </Link>
        <Link
          href={`/${locale}`}
          className="flex-1 rounded-lg border-2 border-mainColor px-6 py-3 text-sm font-semibold text-mainColor transition-all duration-200 ease-in-out hover:bg-mainColor hover:text-white"
        >
          {t("links.backHome")}
        </Link>
      </div>
    </section>
  );
};

export default SchoolRegisterAccessDenied;
